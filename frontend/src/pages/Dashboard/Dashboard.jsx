import React from "react";

const Dashboard = () => {
  return (
    <div className="content-wrapper">
      {/* Header Section */}
      <section className="content-header bg-white p-3 mb-4 border-bottom">
        <div className="container-fluid">
          <div className="row mb-2 align-items-center">
            <div className="col-sm-6">
              <h2 className="m-0">Databricks Job Overview</h2>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-end">
                <li className="breadcrumb-item active" aria-current="page">
                  Home
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Info Boxes Section */}
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {/* Successful Jobs */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="custom-info-box bg-success">
                <span className="icon">
                  <i className="fas fa-check-circle"></i>
                </span>
                <div className="content">
                  <span className="text">Successful Jobs</span>
                  <span className="number">42</span>
                  <div className="progress" style={{ height: "5px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "70%" }}
                      aria-valuenow="70"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span className="description">70% success rate</span>
                </div>
              </div>
            </div>

            {/* Running Jobs */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="custom-info-box bg-warning text-dark">
                <span className="icon">
                  <i className="fas fa-sync-alt"></i>
                </span>
                <div className="content">
                  <span className="text">Running Jobs</span>
                  <span className="number">5</span>
                  <div className="progress" style={{ height: "5px" }}>
                    <div
                      className="progress-bar bg-dark"
                      role="progressbar"
                      style={{ width: "10%" }}
                      aria-valuenow="10"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span className="description">10% currently running</span>
                </div>
              </div>
            </div>

            {/* Failed Jobs */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="custom-info-box bg-danger">
                <span className="icon">
                  <i className="fas fa-exclamation-circle"></i>
                </span>
                <div className="content">
                  <span className="text">Failed Jobs</span>
                  <span className="number">8</span>
                  <div className="progress" style={{ height: "5px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "15%" }}
                      aria-valuenow="15"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span className="description">15% failure rate</span>
                </div>
              </div>
            </div>

            {/* Avg Runtime */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="custom-info-box bg-secondary">
                <span className="icon">
                  <i className="fas fa-clock"></i>
                </span>
                <div className="content">
                  <span className="text">Avg. Runtime</span>
                  <span className="number">
                    12.4<small className="fs-6">min</small>
                  </span>
                  <div className="progress" style={{ height: "5px" }}>
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: "85%" }}
                      aria-valuenow="85"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <span className="description">
                    15% faster than last week
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Job Runs Table */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card job-details-card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h3 className="card-title">Latest Job Runs</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-bs-toggle="collapse"
                      data-bs-target="#latestJobRunsCollapse"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                  </div>
                </div>

                <div
                  className="card-body collapse show"
                  id="latestJobRunsCollapse"
                >
                  <div className="table-responsive">
                    <table className="table table-hover table-striped w-100">
                      <thead className="table-light">
                        <tr>
                          <th>Job Name</th>
                          <th>Status</th>
                          <th>Duration</th>
                          <th>Run Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>LoadCustomerData</td>
                          <td>
                            <span className="status-badge bg-success text-white">
                              Success
                            </span>
                          </td>
                          <td>14 min</td>
                          <td>2025-08-05 19:50</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-eye"></i> View
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>TransformOrders</td>
                          <td>
                            <span className="status-badge bg-danger text-white">
                              Failed
                            </span>
                          </td>
                          <td>8 min</td>
                          <td>2025-08-05 19:50</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-eye"></i> View
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>RefreshInventory</td>
                          <td>
                            <span className="status-badge bg-warning text-dark">
                              Running
                            </span>
                          </td>
                          <td>9 min</td>
                          <td>2025-08-05 19:50</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-eye"></i> View
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>GenerateReports</td>
                          <td>
                            <span className="status-badge bg-success text-white">
                              Success
                            </span>
                          </td>
                          <td>22 min</td>
                          <td>2025-08-05 19:50</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-eye"></i> View
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>UpdateWarehouse</td>
                          <td>
                            <span className="status-badge bg-info text-white">
                              Scheduled
                            </span>
                          </td>
                          <td>-</td>
                          <td>2025-08-05 19:50</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="fas fa-eye"></i> View
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="card-footer clearfix">
                  <a href="#" className="btn btn-sm btn-primary float-end">
                    View All Jobs
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
