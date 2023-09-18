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
};

module.exports = response_data;
