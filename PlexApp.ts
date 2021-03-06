import { IHttp, IModify, IPersistence, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import {
  IConfigurationExtend, IEnvironmentRead, ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IUIKitInteractionHandler,
    UIKitBlockInteractionContext,
    UIKitViewSubmitInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';
import { login } from './lib/helpers/login';
import { PlexCommand } from './commands/PlexCommand';
import { PlexDevicesCommand } from './commands/PlexDevicesCommand';
import { PlexLibrariesCommand } from './commands/PlexLibrariesCommand';
import { PlexLoginCommand } from './commands/PlexLoginCommand';
import { PlexOnDeckCommand } from './commands/PlexOnDeckCommand';
import { PlexPlaybackCommand } from './commands/PlexPlaybackCommand';
import { PlexPlaylistsCommand } from './commands/PlexPlaylistsCommand';
import { PlexResourcesCommand } from './commands/PlexResourcesCommand';
import { PlexScanCommand } from './commands/PlexScanCommand';
import { PlexSearchCommand } from './commands/PlexSearchCommand';
import { PlexServerCommand } from './commands/PlexServerCommand';
import { PlexServersCommand } from './commands/PlexServersCommand';
import { PlexSessionsCommand } from './commands/PlexSessionsCommand';

export class PlexApp extends App implements IUIKitInteractionHandler {
    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext, read: IRead, http: IHttp, persistence: IPersistence, modify: IModify) {
      const data = context.getInteractionData();

      const { state }: {
        state: {
          plexlogin: {
            username: string,
          },
          plexpassword: {
            password: string,
          },
        },
      } = data.view as any;

      if (!state) {
        return context.getInteractionResponder().viewErrorResponse({
          viewId: data.view.id,
          errors: {
            question: 'Error logging in',
          },
        });
      }

      try {
        await login(data, read, modify, http, persistence, data.user.id);
      } catch (err) {
        return context.getInteractionResponder().viewErrorResponse({
          viewId: data.view.id,
          errors: err,
        });
      }

      return {
        success: true,
      };
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
      await configuration.settings.provideSetting({
        id: 'sender',
        type: SettingType.STRING,
        packageValue: 'plex.bot',
        required: true,
        public: false,
        i18nLabel: 'customize_sender',
        i18nDescription: 'customize_sender_description',
      });
      
      await configuration.settings.provideSetting({
        id: 'name',
        type: SettingType.STRING,
        packageValue: 'Plex',
        required: true,
        public: false,
        i18nLabel: 'customize_name',
        i18nDescription: 'customize_name_description',
      });

      await configuration.settings.provideSetting({
        id: 'icon',
        type: SettingType.STRING,
        packageValue: 'https://github.com/tgardner851/Rocket.Chat.App-Plex/raw/master/icon.png',
        required: true,
        public: false,
        i18nLabel: 'customize_icon',
        i18nDescription: 'customize_icon_description',
      });

      await configuration.settings.provideSetting({
        id: 'anon_user_avatar',
        type: SettingType.STRING,
        packageValue: 'https://github.com/tgardner851/Rocket.Chat.App-Plex/raw/master/anon_user_avatar.png',
        required: true,
        public: false,
        i18nLabel: 'customize_anon_user_avatar',
        i18nDescription: 'customize_anon_user_avatar_description',
      });

      await configuration.slashCommands.provideSlashCommand(new PlexCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexLoginCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexServersCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexServerCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexSearchCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexOnDeckCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexSessionsCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexDevicesCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexLibrariesCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexScanCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexPlaylistsCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexResourcesCommand(this));
      await configuration.slashCommands.provideSlashCommand(new PlexPlaybackCommand(this));
    }
}
