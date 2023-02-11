import {
  BusinessLogicActionType,
  Context,
  JoinTeamMailActionParams,
  MessageQueueChannelType,
  MessageQueueProvider,
  MongoDbProvider,
  NotificationParams,
  QueueMessage,
  TeamRole
} from '@open-template-hub/common';
import { Environment } from '../../environment';
import { TeamRepository } from '../repository/team.repository';

export class TeamController {
  constructor(
      private environment = new Environment()
  ) {
    /** intentionally blank */
  }

  getTeams = async (
      mongodb_provider: MongoDbProvider,
      username: string
  ) => {
    const teamRepository = await new TeamRepository().initialize(
        mongodb_provider.getConnection()
    );

    return teamRepository.getTeams(
        username
    );
  };

  create = async (
      context: Context,
      name: string,
      payload: any
  ) => {
    const teamRepository = await new TeamRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    const team = await teamRepository.create(
        context.username,
        name,
        payload
    );

    return { team };
  };

  update = async(
    context: Context,
    teamId: string,
    payload: any
  ) => {
    const teamRepository = await new TeamRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    const team = await teamRepository.update(
      context.username,
      teamId,
      payload
    );

    return { team };
  }

  addMember = async (
    context: Context,
    origin: string,
    teamId: string,
    email: string,
    username: string | undefined,
    teamRole: TeamRole.READER | TeamRole.WRITER
  ) => {
    // check pre conditions
    if ( !email ) {
      throw new Error( 'Email should be given.' );
    }
  
    // init repositorires
    const teamRepository = await new TeamRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    const targetMember: any = {
      email: email,
      isVerified: false,
      payload: { invitationdate: Date.now() }
    };

    if ( username ) {
      targetMember.username = username;
    }

    const team = await teamRepository.addMember(
      context.username,
      teamId,
      targetMember,
      teamRole
    )
  
    if ( !team ) {
      throw new Error( `Can not find the team with given teamId: ${ teamId } or user is already in the team` );
    }
  
    await this.sendTeamEmail(
        context.message_queue_provider,
        origin,
        {
          username: username ?? email,
          email: email
        },
        {
          teamId: team.team_id,
          teamRole: teamRole,
          teamName: team.name
        }
    );
  
    if ( username ) {
      let roleText: string;

      if ( teamRole === TeamRole.READER ) {
        roleText = 'reader';
      }
      else {
        roleText = 'writer';
      }

      await this.sendJoinTeamRequestNotificationToQueue(
          context.message_queue_provider,
          {
            timestamp: new Date().getTime(),
            username: username,
            message: `${ context.username } invited you to join ${ team.name } as ${ roleText }.`,
            sender: context.username,
            category: 'Team'
          }
      );
    }
  
    return { team }; 
  }

  removeMember = async (
    context: Context,
    teamId: string,
    email: string
  ) => {
    const teamRepository = await new TeamRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    const team = await teamRepository.removeMemberByEmail(
      context.username,
      teamId,
      email,
    );

    if ( !team ) {
      throw new Error('Team not found');
    }

    return { team };
  }

  leaveTeam = async (
    context: Context,
    teamId: string,
  ) => {
    const teamRepository = await new TeamRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    const team = await teamRepository.removeMemberByUsername(
      teamId,
      context.username
    );

    if ( !team ) {
      throw new Error('Team not found')
    }

    return { team };
  }

  verifyTeamRequest = async (
    context: Context,
    teamId: string,
  ) => {
    const teamRepository = await new TeamRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    const team = await teamRepository.verify(
      context.username,
      teamId
    );

    if ( !team ) {
      throw new Error('Team not found')
    }

    return { team }
  }

  deleteTeam = async (
      context: Context,
      teamId: string
  ) => {
    const teamRepository = await new TeamRepository().initialize(
        context.mongodb_provider.getConnection()
    );

    const team = await teamRepository.deleteTeam(
      context.username,
      teamId
    );

    if ( !team ) {
      throw new Error('Team not found')
    }

    return { team };
  };

  setUsernameUsingEmail = async (
    context: Context,
    email: string,
    username: string
  ) => {
    const teamRepository = await new TeamRepository().initialize(
      context.mongodb_provider.getConnection()
    );

    await teamRepository.setUsernameUsingEmail(
      email,
      username
    )

    return { }
  }

  private sendTeamEmail = async (
      messageQueueProvider: MessageQueueProvider,
      origin: string,
      targetUser: {
        username: string,
        email: string
      },
      targetTeam: {
        teamId: string,
        teamRole: TeamRole,
        teamName: string
      }
  ) => {
    const orchestrationChannelTag = this.environment.args().mqArgs?.orchestrationServerMessageQueueChannel;

    const joinTeamParams = {
      user: targetUser.username,
      userLinkName: targetUser.username,
      email: targetUser.email,
      teamId: targetTeam.teamId,
      teamName: targetTeam.teamName,
      teamLinkName: targetTeam.teamName,
      teamRole: targetTeam.teamRole,
      joinTeamUrl: origin + '/callback/join-team'
    } as JoinTeamMailActionParams;

    const message = {
      sender: MessageQueueChannelType.BUSINESS_LOGIC,
      receiver: MessageQueueChannelType.MAIL,
      message: {
        mailType: {
          joinTeam: {
            params: joinTeamParams
          }
        }
      }
    };

    await messageQueueProvider.publish(
        message,
        orchestrationChannelTag as string
    );
  };

  private async sendJoinTeamRequestNotificationToQueue(
      messageQueueProvider: MessageQueueProvider,
      notificationParams: NotificationParams
  ) {
    const orchestrationChannelTag = this.environment.args().mqArgs?.orchestrationServerMessageQueueChannel;

    const message = {
      sender: MessageQueueChannelType.BUSINESS_LOGIC,
      receiver: MessageQueueChannelType.BUSINESS_LOGIC,
      message: {
        notification: {
          params: notificationParams
        }
      } as BusinessLogicActionType
    } as QueueMessage;

    await messageQueueProvider.publish(
        message,
        orchestrationChannelTag as string
    );
  }
}
