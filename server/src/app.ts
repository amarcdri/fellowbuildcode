import dotenv from 'dotenv';
import express, {Request,Response,Application} from 'express';
import cors from 'cors';
// import fileUpload from 'express-fileupload';
var fileUpload = require("express-fileupload");

dotenv.config();

const app:Application = express();

app.use(cors({origin: '*'}));
app.use(express.json());
app.use(fileUpload());
// Logic goes here
import auth from './controllers/AuthController';
import user from './controllers/UserController';
import team from './controllers/TeamController';
import proposal from './controllers/ProposalController';
import qpr from './controllers/QprController';
app.post('/api/register', (req:Request, res:Response):void => {
  auth.register(req, res); 
}); 
app.post('/api/login', (req:Request, res:Response):void => {
  auth.login(req, res);
}); 

import auth_web from './middleware/auth';
app.get('/api/users', auth_web, (req:Request, res:Response) => {
  user.list(req, res);
});
app.get('/api/team', auth_web, (req:Request, res:Response) => {
  team.list(req, res);
});
app.post('/api/team/:team_id/edit', auth_web, (req:Request, res:Response) => {
  team.edit(req, res);
});
app.get('/api/proposals', auth_web, (req:Request, res:Response) => {
  proposal.list(req, res);
});
app.get('/api/qpr', auth_web, (req:Request, res:Response) => {
  qpr.list(req, res);
});
app.get('/api/qpr/:qpr_id/basic-information', auth_web, (req:Request, res:Response) => {
  qpr.basicInformation(req, res);
});
app.post('/api/qpr/:qpr_id/basic-information', auth_web, (req:Request, res:Response) => {
  qpr.basicInformationSave(req, res);
});
app.get('/api/qpr/:qpr_id/research-background', auth_web, (req:Request, res:Response) => {
  qpr.researchBackground(req, res);
});
app.post('/api/qpr/:qpr_id/research-background', auth_web, (req:Request, res:Response) => {
  qpr.researchBackgroundSave(req, res);
});
app.get('/api/qpr/:qpr_id/progress-report', auth_web, (req:Request, res:Response) => {
  qpr.progressReport(req, res);
});
app.post('/api/qpr/:qpr_id/progress-report', auth_web, (req:Request, res:Response) => {
  qpr.progressReportSave(req, res);
});
app.get('/api/qpr/:qpr_id/plan-for-remaining-quarter', auth_web, (req:Request, res:Response) => {
  qpr.planForRemainingQuarter(req, res);
});
app.post('/api/qpr/:qpr_id/plan-for-remaining-quarter', auth_web, (req:Request, res:Response) => {
  qpr.planForRemainingQuarterSave(req, res);
});
app.get('/api/qpr/:qpr_id/project-gantt-chart', auth_web, (req:Request, res:Response) => {
  qpr.projectGanttChart(req, res);
});
app.post('/api/qpr/:qpr_id/project-gantt-chart', auth_web, (req:Request, res:Response) => {
  qpr.projectGanttChartSave(req, res);
});
app.delete('/api/qpr/:qpr_id/project-gantt-chart/:pgc_id', auth_web, (req:Request, res:Response) => {
  qpr.projectGanttChartDelete(req, res);
});
app.post('/api/qpr/:qpr_id/submit', auth_web, (req:Request, res:Response) => {
  qpr.submit(req, res);
});

export = app;