export const BASE_URL = "https://kn-demand-dev-emachzhqzq-uc.a.run.app/";

export const demandFiles = async (files: File[]) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append("files", file);
  });

  const promise = fetch(`${BASE_URL}demand/uploadfile`, {
    method: "POST",
    body: formData,
  });

  return promise;
};

export const fetchUploadStatus = async () => {
  const response = await fetch(`${BASE_URL}demand/uploadstatus`);
  const data = await response.json();
  return data;
};
