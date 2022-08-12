import ErrorException from '../error/ErrorException';
import Team from '../models/Team';

class TeamController extends Team {
  list = async (req:any, res:any) => {
    await this.getData({ select: 'a.*, b.CountryName as country_name', join: ' JOIN countries b on a.country_id = b.id', where: 'user_id = ?', other: 'ORDER BY name ASC', args: [req.auth.id] }).then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        data: {list: rslt}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    );
  }

  edit = (req:any, res:any) => {
    req = {input: req.body, id: req.params.team_id};
    this.updateData(req)
    .then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        msg: "Saved successfully",
        type: "success",
        data: {team_member: rslt[0]}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    )
  }
}

export = new TeamController;