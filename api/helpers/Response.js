const response_data = {
  send: (values, res) => {
    res.json(values);
    res.end();
  },
  ok: (values, res, message, fields) => {
    let data = {
      success: true,
      status: 200,
      data: values,
      message,
      fields,
    };
    res.json(data);
    res.end();
  },
  back: (code, values, message, fields) => {
    let data = {
      status: code,
      data: values,
      message,
      fields,
    };
    return data;
  },
  success: (res, fields) => {
    let data = {
      success: true,
      status: 201,
      data: null,
      message: `Success with empty data`,
      fields,
    };
    res.json(data);
    res.end();
  },
  error: (status, message, res, err, fields) => {
    let data = {
      success: false,
      status,
      message,
      err,
      fields,
    };
    res.json(data);
    res.end();
  },
  done: (message, res, token) => {
    let data = {
      success: true,
      status: 200,
      message: message,
      token: token,
    };
    res.json(data);
    res.end();
  },
  redirect: (url, res) => {
    res.redirect(url);
  },
  unauthorized: (data, res, message) => {
    return res.status(401).json({
      success: false,
      message: message || "Unauthorized",
      data: data || null,
    });
  },
  gagal: (status, message, res, err = {}) => {
    res.status(status).send({ success: false, status, message, err });
  },
  badRequest: function (data, res, message) {
    return res.status(400).json({
      status: false,
      message: message,
      data: data,
    });
  },
};

module.exports = response_data;
