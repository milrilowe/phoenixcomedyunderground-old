import { db } from '@/lib/db'
import type { MessageInput } from '@/lib/schemas/messages'

export const messagesService = {
    /**
     * Send a message from the contact form
     * Stores the message in the database for admin review
     */
    async send(data: MessageInput) {
        try {
            return await db.message.create({
                data: {
                    ...data,
                    read: false
                }
            });
        } catch (error) {
            console.error('Error creating message:', error);
            throw error;
        }
    },

    /**
     * Get all messages
     * For admin use to review contact form submissions
     */
    async getAll() {
        return db.message.findMany({
            orderBy: { createdAt: 'desc' }
        });
    },

    /**
     * Get a message by ID
     */
    async getById(id: number) {
        return db.message.findUnique({
            where: { id }
        });
    },

    /**
     * Mark a message as read
     */
    async markAsRead(id: number) {
        return db.message.update({
            where: { id },
            data: { read: true }
        });
    },

    /**
     * Delete a message
     */
    async delete(id: number) {
        return db.message.delete({
            where: { id }
        });
    }
}