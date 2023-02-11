import { authorizedBy, ResponseCode, TeamRole, UserRole } from '@open-template-hub/common';
import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { TeamController } from '../controller/team.controller';

const subRoutes = {
  root: '/',
  member: '/member',
  verify: '/verify',
  leave: '/leave',
  set: '/set'
};

export const router = Router();

router.get( subRoutes.root, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ), async ( req: Request, res: Response ) => {
  const context = res.locals.ctx;

  const teamController = new TeamController();

  const teams = await teamController.getTeams(
      context.mongodb_provider,
      context.username
  );

  res.status( ResponseCode.OK ).json( teams );
} );

router.post( subRoutes.root, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ), async ( req: Request, res: Response ) => {
  const teamController = new TeamController();

  const teamCreateResponse = await teamController.create(
      res.locals.ctx,
      req.body.name,
      req.body.payload
  );

  res.status( ResponseCode.OK ).json( teamCreateResponse );
} );

router.put( subRoutes.root, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ), async ( req: Request, res: Response) => {
  const teamController = new TeamController();

  const teamUpdateResponse = await teamController.update(
    res.locals.ctx,
    req.body.teamId,
    req.body.payload
  );
  
  res.status( ResponseCode.OK ).json( teamUpdateResponse );
} );

router.delete( subRoutes.root, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ), async ( req: Request, res: Response ) => {
  const teamController = new TeamController();

  const response = await teamController.deleteTeam(
      res.locals.ctx,
      req.query.teamId as string
  );

  res.status( ResponseCode.OK ).json( response );
} );

router.post( subRoutes.member, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ), async ( req: Request, res: Response ) => {
  const teamController = new TeamController();

  console.log(req.body)

  const addMemberResponse = await teamController.addMember(
      res.locals.ctx,
      req.query.origin as string,
      req.body.teamId,
      req.body.email as string,
      req.body.username as string | undefined,
      req.body.teamRole as TeamRole.WRITER | TeamRole.READER 
  );

  res.status( ResponseCode.OK ).json( addMemberResponse );
} );

router.delete( subRoutes.member, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ), async ( req: Request, res: Response ) => {
  const teamController = new TeamController();

  const response = await teamController.removeMember(
      res.locals.ctx,
      req.query.teamId as string,
      req.query.email as string
  );

  res.status( ResponseCode.OK ).json( response );
} );

router.post( subRoutes.verify, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ), async ( req: Request, res: Response ) => {
  const teamController = new TeamController();
  const context = res.locals.ctx;

  const verifyResponse = await teamController.verifyTeamRequest(
    context,
    req.body.teamId
  )

  res.status( ResponseCode.OK ).json( verifyResponse );
} );

router.post( subRoutes.leave, authorizedBy( [ UserRole.ADMIN, UserRole.DEFAULT ] ), async ( req: Request, res: Response ) => {
  const teamController = new TeamController();
  const context = res.locals.ctx;

  const leaveResponse = await teamController.leaveTeam(
    context,
    req.body.teamId
  );

  res.status( ResponseCode.OK ).json( leaveResponse );
});

router.post ( subRoutes.set, async ( req: Request, res: Response ) => {
  const teamController = new TeamController();
  const context = res.locals.ctx;

  const response = await teamController.setUsernameUsingEmail(
    context,
    req.body.email,
    req.body.username
  );

  res.status( ResponseCode.OK ).json( response );
});

