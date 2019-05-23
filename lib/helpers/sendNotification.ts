import { IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { IRoom } from '@rocket.chat/apps-engine/definition/rooms';
import { IUser } from '@rocket.chat/apps-engine/definition/users';

export async function sendNotification(text: string, read: IRead, modify: IModify, user: IUser, room: IRoom): Promise<void> {
    const icon = await read.getEnvironmentReader().getSettings().getValueById('plex_icon');
    const username = await read.getEnvironmentReader().getSettings().getValueById('plex_name');
    const sender = await read.getUserReader().getById('rocket.cat');

    modify.getNotifier().notifyUser(user, modify.getCreator().startMessage({
        sender,
        room,
        text,
        groupable: false,
        alias: username,
        avatarUrl: icon,
    }).getMessage());
}
