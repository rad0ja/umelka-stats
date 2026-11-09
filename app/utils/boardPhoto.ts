// Board photo = a photo of the whiteboard the score was tallied on, attached to its match as evidence.
// Stored in the public `board-photos` bucket; matches.board_photo_path points at the current file.
import { supabase } from "@/lib/supabase";

const BUCKET = "board-photos";
const MAX_SIDE = 2000;
const JPEG_QUALITY = 0.8;

export const boardPhotoUrl = (path: string) =>
    supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

// Re-encode to a JPEG with the longest side at most MAX_SIDE px. Drawing through a canvas also drops
// EXIF metadata (GPS etc.); browsers apply the EXIF orientation when drawing, so the result stays upright.
async function shrinkPhoto(file: File): Promise<Blob> {
    const url = URL.createObjectURL(file);
    try {
        const img = new Image();
        img.src = url;
        try {
            await img.decode();
        } catch {
            throw new Error("Couldn't read this photo. Try a screenshot of it instead.");
        }
        const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
        if (!blob) throw new Error("Couldn't process this photo.");
        return blob;
    } finally {
        URL.revokeObjectURL(url);
    }
}

// Upload a new board photo for the match and point the match at it; the previous file (if any) is deleted.
// A fresh file name per upload keeps the CDN from serving a stale photo after a replace.
export async function uploadBoardPhoto(matchId: string, file: File, previousPath?: string | null): Promise<string> {
    const blob = await shrinkPhoto(file);
    const path = `${matchId}/${Date.now()}.jpg`;

    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg" });
    if (uploadError) throw new Error(uploadError.message);

    const { error: updateError } = await supabase.from("matches").update({ board_photo_path: path }).eq("id", matchId);
    if (updateError) {
        await supabase.storage.from(BUCKET).remove([path]);
        throw new Error(updateError.message);
    }

    // Best effort: a leftover old file only costs storage
    if (previousPath) await supabase.storage.from(BUCKET).remove([previousPath]);
    return path;
}

export async function removeBoardPhoto(matchId: string, path: string): Promise<void> {
    const { error } = await supabase.from("matches").update({ board_photo_path: null }).eq("id", matchId);
    if (error) throw new Error(error.message);
    await supabase.storage.from(BUCKET).remove([path]);
}
