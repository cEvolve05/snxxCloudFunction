exports.onError = (err, errText="Unknown error, logged on server") => {
    console.error(err)
    return {
      isErr: true,
      err: errText
    }
  };