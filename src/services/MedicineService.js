import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAlltype = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/medicine/get-all-type`
  );
  return res.data;
};

export const getAllTabletsname = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/medicine/getalltabletsname`
  );
  return res.data;
};

export const getAllGelsname = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/medicine/getallgelsname`
  );
  return res.data;
};

export const getAllPowdersname = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/medicine/getallpowdersname`
  );
  return res.data;
};

export const getAllLiquorsname = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/medicine/getallliquorsname`
  );
  return res.data;
};

export const getAllItem = async (search, limit) => {
  let res = {};
  if (search?.length > 0) {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/medicine/get-all?filter=name&filter=${search}&limit=${limit}`
    );
  } else {
    res = await axios.get(
      `${process.env.REACT_APP_API_URL}/medicine/get-all?limit=${limit}`
    );
  }
  return res.data;
};

export const getAllTypeItem = async () => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/medicine/get-all-type`
  );
  return res.data;
};

export const getItemType = async (type, page, limit) => {
  if (type) {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/medicine/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`
    );
    return res.data;
  }
};

export const createItem = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/medicine/create`,
    data
  );
  return res.data;
};

export const getDetailsItem = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/medicine/get-details/${id}`
  );
  return res.data;
};

export const updateItem = async (id, access_token, data) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/medicine/update/${id}`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteItem = async (id, access_token) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/medicine/delete/${id}`,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};

export const deleteManyItem = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/medicine/delete-many`,
    data,
    {
      headers: {
        token: `Bearer ${access_token}`,
      },
    }
  );
  return res.data;
};
