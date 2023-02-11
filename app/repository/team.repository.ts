import { TeamRole } from '@open-template-hub/common';
import { TeamDataModel } from '../data/team.data';

export class TeamRepository {
  private dataModel: any = null;

  initialize = async ( connection: any ) => {
    this.dataModel = await new TeamDataModel().getDataModel( connection );
    return this;
  };

  create = async ( creator: string, name: string, payload: any ) => {
    try {
      return await this.dataModel.create( {
        creator, name, payload
      } );
    } catch ( error ) {
      console.error( '> createTeam error: ', error );
      throw error;
    }
  };

  /// Allowed team role: Creator
  update = async( authorizedUsername: string, teamId: string, payload: any ) => {
    try {
      return await this.dataModel.findOneAndUpdate(
        {
          creator: authorizedUsername,
          team_id: teamId
        },
        {
          payload
        },
        {
          returnOriginal: false
        }
      )
    } catch ( error ) {
      console.error( '> updateTeam error ', error );
    }
  }

  /// Allowed team role: Creator
  addMember = async (
    authorizedUsername: string,
    teamId: string,
    member: {
      username?: string,
      email: string,
      isVerified: boolean,
      payload: any
    },
    teamRole: TeamRole.READER | TeamRole.WRITER
  ) => {
    try {
      let targetTeamArray: { writers: any } | { readers: any };

      if ( teamRole === TeamRole.READER ) {
        targetTeamArray = { readers: member }
      }
      else {
        targetTeamArray = { writers: member }
      }

      return await this.dataModel.findOneAndUpdate(
          {
            team_id: teamId,
            'writers.email': { $ne: member.email },
            'readers.email': { $ne: member.email },
            $and: [ { creator: { $ne: member.username } }, { creator: { $eq: authorizedUsername } } ]
          },
          {
            $addToSet: targetTeamArray
          },
          {
            returnOriginal: false
          }
      );
    } catch ( error ) {
      console.error( '> addMember error: ', error );
      throw error;
    }
  };

  /// Allowed team role: Creator
  removeMemberByEmail = async (
    authorizedUsername: string,
    teamId: string,
    email: string,
  ) => {
    try {
      const readerResponse = await this.dataModel.findOneAndUpdate(
        {
          creator: authorizedUsername,
          'readers.email': email,
          team_id: teamId
        },
        {
          $pull: { readers: { email } } 
        },
        {
          returnOriginal: false
        }
      );

      if ( !readerResponse ) {
        return await this.dataModel.findOneAndUpdate(
          {
            creator: authorizedUsername,
            'writers.email': email,
            team_id: teamId
          },
          {
            $pull: { writers: { email } } 
          },
          {
            returnOriginal: false
          }
        );
      }

      return readerResponse

    } catch ( error ) {
      console.error( '> removeMemberByEmail error: ', error );
      throw error;
    }
  }

  removeMemberByUsername = async (
    teamId: string,
    username: string,
  ) => {
    try {
      const readerResponse = await this.dataModel.findOneAndUpdate(
        {
          team_id: teamId
        },
        {
          $pull: { readers: { username } }
        },
        {
          returnOriginal: false
        }
      );

      if ( !readerResponse ) {
        return await this.dataModel.findOneAndUpdate(
          {
            team_id: teamId
          },
          {
            $pull: { writers: { username } }
          },
          {
            returnOriginal: false
          }
        )
      };

      return readerResponse;

    } catch ( error ) {
      console.error( '> removeMember error: ', error );
      throw error;
    }
  }

  getTeams = async (
      username: string
  ) => {
    try {
      return await this.dataModel.find(
          {
            $or: [
              { creator: username },
              {
                writers: {
                  $elemMatch: {
                    username
                  }
                }
              },
              {
                readers: {
                  $elemMatch: {
                    username
                  }
                }
              }
            ]
          }
      );
    } catch ( error ) {
      console.error( '> getTeam error: ', error );
      throw error;
    }
  };

  verify = async (
      username: string,
      teamId: string,
  ) => {
    // email should be written 
    try {
      const writerResponse = await this.dataModel.findOneAndUpdate(
          { team_id: teamId, 'writers.username': username},
          {
            $set: {
              'writers.$.username': username,
              'writers.$.isVerified': true
            }
          },
          {
            returnOriginal: false
          }
      );

      if ( !writerResponse ) {
        return await this.dataModel.findOneAndUpdate(
          { team_id: teamId, 'readers.username': username },
          {
            $set: {
              'readers.$.username': username,
              'readers.$.isVerified': true
            }
          },
          {
            returnOriginal: false
          }
        );
      }

      return writerResponse;

    } catch ( error ) {
      console.error( '> verifyTeam error: ', error );
      throw error;
    }
  };

  deleteTeam = async (
    authorizedUsername: string,
    teamId: string
  ) => {
    try {
      return await this.dataModel.findOneAndDelete(
          { creator: authorizedUsername, team_id: teamId }
      );
    } catch ( error ) {
      console.error( '> deleteTeam error: ', error );
      throw error;
    }
  };

  setUsernameUsingEmail = async (
    email: string,
    username: string
  ) => {
    try {
      await this.dataModel.updateMany(
        { 'writers.email': email },
        { $set: { 'writers.$.username': username } }
      );

      await this.dataModel.updateMany(
        { 'readers.email': email },
        { $set: { 'readers.$.username': username } }
      )
    } catch ( error ) {
      console.error( '> setUsernameUsingEmail error: ', error );
      throw error;
    }
  }
}

