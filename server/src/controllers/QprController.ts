import Qpr from '../models/Qpr';
import ErrorException from '../error/ErrorException';
const { UPLOAD_PATH } = process.env;

class QprController extends Qpr {
  constructor() {
    super();
    this.fields = 'a.id, a.appid, a.qpr_no, a.quarter, a.form_validation, a.submit_status, ';
    this.basic_information_fields = this.fields+'a.name, a.sanctioned_amount, a.fund_received_date, a.expenditure_status, a.mentor_name, a.mentor_email, a.mentor_organization, a.mentor_designation, a.research_title';
    this.research_objective_fields = this.fields+'a.research_objective, a.expected_outcome, a.deviation';
    this.progress_report_fields = this.fields+'a.activity_planned, a.planned_activity_status, a.non_performance_reason, a.non_performance_project_plan, a.progress_summery, a.author_name, a.paper_title, a.journal, a.volume, a.year, a.page_number, a.other_update';
    this.plan_for_remaining_quarter_fields = this.fields+'';
  }

  list = (req:any, res:any) => {
    this.getData({ select: 'id, appid, qpr_no, quarter, submit_status, user_status, mentor_status, admin_status, created_at', other: 'ORDER BY quarter ASC', args: [req.params.appid] }).then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        data: {list: rslt}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    );
  }
  
  basicInformation = (req:any, res:any) => {
    this.getData({ select: this.basic_information_fields, other: 'ORDER BY id DESC', args: [req.params.qpr_id] }).then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        data: {basic_information: rslt[0]}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    );
  }

  basicInformationSave = (req:any, res:any) => {
    let msg = req.body.submit_status == 1? "Saved successfully": "Saved as draft";
    let type = req.body.submit_status == 1? "success": "warning";
    delete req.body.submit_status;
    req = {input: req.body, id: req.params.qpr_id, select: this.basic_information_fields};
    this.updateData(req)
    .then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        msg: msg,
        type: type,
        data: {basic_information: rslt[0]}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    )
  }

  researchBackground = (req:any, res:any) => {
    this.getData({ select: this.research_objective_fields, other: 'ORDER BY id DESC', args: [req.params.qpr_id] }).then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        data: {research_background: rslt[0]}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    );
  }

  researchBackgroundSave = (req:any, res:any) => {
    let msg = req.body.submit_status == 1? "Saved successfully": "Saved as draft";
    let type = req.body.submit_status == 1? "success": "warning";
    delete req.body.submit_status;
    req = {input: req.body, id: req.params.qpr_id, select: this.research_objective_fields};
    this.updateData(req)
    .then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        msg: msg,
        type: type,
        data: {research_background: rslt[0]}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    )
  }
  
  progressReport = (req:any, res:any) => {
    this.getData({ select: this.progress_report_fields, other: 'ORDER BY id DESC', args: [req.params.qpr_id] }).then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        data: {progress_report: rslt[0]}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    );
  }

  progressReportSave = (req:any, res:any) => {
    let msg = req.body.submit_status == 1? "Saved successfully": "Saved as draft";
    let type = req.body.submit_status == 1? "success": "warning";
    delete req.body.submit_status;
    req = {input: req.body, id: req.params.qpr_id, select: this.progress_report_fields};
    this.updateData(req)
    .then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        msg: msg,
        type: type,
        data: {progress_report: rslt[0]}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    )
  }
  
  planForRemainingQuarter = (req:any, res:any) => {
    let fields = this.fields.slice(0, -2);
    this.getData({ select: fields, other: 'ORDER BY id DESC', args: [req.params.qpr_id] }).then((rslt: any) => {
      this.getData({ table: "plan_for_remaining_quarter", other: 'ORDER BY id ASC', where: "qpr_id=?", args: [req.params.qpr_id] }).then((rslt1: any) => {
        rslt[0].prq = rslt1;
        res.status(200).json({ 
          status: 1,
          data: {plan_for_remaining_quarter: rslt[0]}
        });
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    );
  }

  planForRemainingQuarterSave = (req:any, res:any) => {
    if(!req.body.plan) {
      return new ErrorException({msg: "Please fill the activities"}, res);
    }
    let msg = req.body.submit_status == 1? "Saved successfully": "Saved as draft";
    let type = req.body.submit_status == 1? "success": "warning";
    delete req.body.submit_status;
    let arr = JSON.parse(req.body.plan);
    const plans: any = [];
    arr.forEach((element: any) => {
      plans.push([req.params.qpr_id, element.timeline, element.planned_activities]);
    });
    let fields = this.fields.slice(0, -2);
    let update_req = {input: {form_validation: req.body.form_validation}, id: req.params.qpr_id, select: fields};
    this.updateData(update_req)
    .then((rslt: any) => {
      let table = "plan_for_remaining_quarter";
      this.deleteData({table: table, where: {fields: "qpr_id=?", args: [req.params.qpr_id] }})
      this.bulkInsertData({
        table: table, 
        fields: "qpr_id, timeline, planned_activities", 
        input: [plans],
        get_where: {
          where: "qpr_id = ?",
          args: [req.params.qpr_id]
        }
      }).then((rslt1: any) => {
          rslt[0].prq = rslt1;
          res.status(200).json({ 
            status: 1,
            msg: msg,
            type: type,
            data: {plan_for_remaining_quarter: rslt[0]}
          });
        },
        (err: any) => new ErrorException({msg: err}, res)
      );
    },
    (err: any) => new ErrorException({msg: err}, res)
    )
  }

  projectGanttChart = (req:any, res:any) => {
    let fields = this.fields.slice(0, -2);
    this.getData({ select: fields, other: 'ORDER BY id DESC', args: [req.params.qpr_id] }).then((rslt: any) => {
      this.getData({ table: "project_gantt_chart", other: 'ORDER BY id ASC', where: "qpr_id=?", args: [req.params.qpr_id] }).then((rslt1: any) => {
        rslt[0].pgc = rslt1;
        res.status(200).json({ 
          status: 1,
          data: {project_gantt_chart: rslt[0]}
        });
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    );
  }

  projectGanttChartSave = (req:any, res:any) => {
    if(!req.files) {
      return new ErrorException({msg: "Please select the files"}, res);
    }
    let msg = req.body.submit_status == 1? "Uploaded successfully": "Saved as draft";
    let type = req.body.submit_status == 1? "success": "warning";
    delete req.body.submit_status;
    let arr = req.files.charts;
    const charts: any = [];
    const fs = require('fs');
    const dir = "/project_gantt_chart/"+req.params.qpr_id;
    let path = UPLOAD_PATH+dir;
    !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true });
    let name = "";
    let file_name = "";
    const fileName = (file_name: string) => {
      const extension = file_name.split('.').pop();
      const filename = file_name.split('.'+extension)[0];
      const new_file_name = filename+'-' + Date.now() + '.' + extension;
      return new_file_name;
    }

    const chartName = (file_name: string) => {
      const extension = file_name.split('.').pop();
      const name = file_name.split('.'+extension)[0];
      return name;
    }
    if(arr.length == undefined) {
      name = chartName(arr.name);
      file_name = fileName(arr.name);
      charts.push([req.params.qpr_id, name, dir+"/"+file_name]);
      arr.mv(path+"/"+file_name, function(err: any) {
        if (err) {
          return new ErrorException({msg: err}, res);
        }
      });
    } else if(arr.length>1) {
      arr.forEach((element: any) => {
        name = chartName(element.name);
        file_name = fileName(element.name);
        charts.push([req.params.qpr_id, name, dir+"/"+file_name]);
        element.mv(path+"/"+file_name, function(err: any) {
          if (err) {
            return new ErrorException({msg: err}, res);
          }
        });
      });
    }
    let fields = this.fields.slice(0, -2);
    let update_req = {input: {form_validation: req.body.form_validation}, id: req.params.qpr_id, select: fields};
    this.updateData(update_req)
    .then((rslt: any) => {
      let table = "project_gantt_chart";
      this.bulkInsertData({
        table: table, 
        fields: "qpr_id, name, chart", 
        input: [charts],
        get_where: {
          where: "qpr_id = ?",
          args: [req.params.qpr_id]
        }
      }).then((rslt1: any) => {
          rslt[0].pgc = rslt1;
          res.status(200).json({ 
            status: 1,
            msg: msg,
            type: type,
            data: {project_gantt_chart: rslt[0]}
          });
        },
        (err: any) => new ErrorException({msg: err}, res)
      );
    },
    (err: any) => new ErrorException({msg: err}, res)
    )
  }

  projectGanttChartDelete = (req:any, res:any) => {
    let table = "project_gantt_chart";
    this.getData({ table: table, where: "id=?", args: [req.params.pgc_id] }).then((rslt: any) => {
      let pgc = rslt[0];
      let fs = require('fs');
      fs.unlinkSync(UPLOAD_PATH+pgc.chart);

      this.deleteData({table: table, where: {args: [req.params.pgc_id] }, get_where: {qpr_id: req.params.qpr_id}})
      .then((rslt: any) => {
        res.status(200).json({ 
          status: 1,
          msg: "Submitted successfully",
          type: "success",
          data: {pgc: rslt}
        });
      },
      (err: any) => new ErrorException({msg: err}, res)
      )
    },
    (err: any) => new ErrorException({msg: err}, res)
    );
  }

  submit = (req:any, res:any) => {
    let fields = this.fields.slice(0, -2);
    req = {input: req.body, id: req.params.qpr_id, select: fields};
    this.updateData(req)
    .then((rslt: any) => {
      res.status(200).json({ 
        status: 1,
        msg: "Submitted successfully",
        type: "success",
        data: {qpr: rslt[0]}
      });
    },
    (err: any) => new ErrorException({msg: err}, res)
    )
  }
}

export = new QprController;