async function overwolfHttpRequest(
  url: string,
  method: string,
  data?: any
): Promise<any> {
  const headers = [{ key: "Content-Type", value: "application/json" }];

  return new Promise((resolve, reject) => {
    overwolf.web.sendHttpRequest(
      url,
      method as overwolf.web.enums.HttpRequestMethods,
      headers,
      JSON.stringify(data),
      (result) => {
        console.log(
          "Raw result from overwolf.web.sendHttpRequest:",
          url,
          result
        );
        if (result.statusCode === 200) {
          try {
            const parsedData = JSON.parse(result.data as string);
            resolve(parsedData);
          } catch (error) {
            console.error("Error parsing JSON:", error);
            reject(new Error("Failed to parse response data"));
          }
        } else {
          reject(
            new Error(
              `HTTP error! status: ${result.statusCode}, error: ${result.data}`
            )
          );
        }
      }
    );
  });
}

export { overwolfHttpRequest };
