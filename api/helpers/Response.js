const response_data = {
  // Respond with a successful OK response
  ok: (values, res, message, fields) => {
    const data = {
      success: true,
      status: 200,
      data: values,
      message,
      fields, // Include any additional metadata here
    };
    res.status(200).json(data);
  },

  // Respond with a custom status code and data
  custom: (code, values, message, fields, res) => {
    const data = {
      status: code,
      data: values,
      message,
      fields,
    };
    res.json(data);
  },

  // Respond with a successful response indicating success with empty data
  success: (res, fields) => {
    const data = {
      success: true,
      status: 201,
      data: null,
      message: `Success with empty data`,
      fields,
    };
    res.json(data);
  },

  // Redirect to a different URL
  redirect: (url, res) => {
    res.redirect(url);
  },

  // Respond with an unauthorized status code and message
  unauthorized: (res, message, data = null) => {
    res.status(401).json({
      success: false,
      message: message || "Unauthorized",
      data,
    });
  },

  // Respond with a specific status code, message, and optional error
  customError: (status, message, res, err = {}, data = null) => {
    res.status(status).json({ success: false, status, message, err, data });
  },

  // Respond with a Bad Request status code and message
  badRequest: (res, message, data = null) => {
    res.status(400).json({ success: false, status: 400, message, data });
  },
};

module.exports = response_data;
