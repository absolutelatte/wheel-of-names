import { z } from 'zod';

export const channelSchema = z
  .string()
  .min(3, 'Channel name must be at least 3 characters')
  .max(25, 'Channel name must be at most 25 characters')
  .regex(/^[A-Za-z0-9_]+$/, 'Channel name can only contain letters, numbers, and underscores');

export type Channel = z.infer<typeof channelSchema>;

export const participantSchema = z
  .string()
  .min(1, 'Participant name is required')
  .max(50, 'Participant name must be at most 50 characters')
  .trim();

export type Participant = z.infer<typeof participantSchema>;

export const participantsListSchema = z.array(participantSchema).max(100, 'Maximum 100 participants allowed');

export type ParticipantsList = z.infer<typeof participantsListSchema>;

export function validateChannel(channel: string): boolean {
  return channelSchema.safeParse(channel).success;
}

export function validateParticipant(participant: string): boolean {
  return participantSchema.safeParse(participant).success;
}
