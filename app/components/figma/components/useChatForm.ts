import { useState } from 'react'

interface UseChatFormOptions {
  onSendMessage: (message: string) => Promise<void>
  sending: boolean
}

export function useChatForm({ onSendMessage, sending }: UseChatFormOptions) {
  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const messageToSend = newMessage
    setNewMessage('')

    try {
      await onSendMessage(messageToSend)
    } catch {
      // Restore message on error
      setNewMessage(messageToSend)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return {
    newMessage,
    setNewMessage,
    handleSubmit,
    handleKeyDown,
  }
}
