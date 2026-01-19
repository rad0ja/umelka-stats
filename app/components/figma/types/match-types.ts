import { Tables, Database } from '@/app/types/database.types';

export type Event = Tables<'events'>;
export type ParticipationStatus = Database['public']['Enums']['participation_status'];

export interface Participant {
  user_id: string;
  name: string;
}

export interface EventParticipants {
  going: Participant[];
  notGoing: Participant[];
  queued: Participant[];
  tentative: Participant[];
}

export interface EventWithParticipants extends Event {
  participants: EventParticipants;
  currentUserStatus?: ParticipationStatus | null;
}
