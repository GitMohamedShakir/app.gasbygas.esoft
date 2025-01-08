import { HTTP_STATUS } from "@/constants/common";
import client from "../client";
import { RequestStatus } from "@/app/api/types/requests";

interface RequestsState {
  list: IRequest[]
}

interface IRequest {
  _id?: string;
  outlet: string;
  quantity: number;
  token?: string;
  dateRequested: string;
  status?: RequestStatus;
}
interface IUpdateRequest {
  _id?: string;
  status?: RequestStatus;
}

export const requests = {
  state: {
    list: []
  } as RequestsState,
  reducers: {
    setRequests(state: RequestsState, list: any[]) {
      return { ...state, list };
    },
    updateRequestStatus(state: RequestsState, _id: string, status: RequestStatus) {
      return {
        ...state, list: state.list.map(r => {
          if (r._id === _id) {
            return { ...r, status }
          }

          return r
        })
      };
    },
  },
  effects: (dispatch: any) => ({
    async fetchRequests() {
      try {
        const { status, data } = await client.get('/api/v1/requests');
        if (status === HTTP_STATUS.OK) {
          dispatch.requests.setRequests(data);
        }
      } catch (error) {
        throw error
      }
    },
    async createRequest(payload: IRequest) {
      try {
        const { status, data } = await client.post('/api/v1/requests', payload);
        if (status === HTTP_STATUS.CREATED) {
          return data;
        }
      } catch (error) {
        throw error
      }
    },
    async issueRequest(payload: IUpdateRequest) {
      try {
        const { status, data } = await client.put('/api/v1/requests/issue', payload);
        if (status === HTTP_STATUS.CREATED) {
          dispatch.requests.updateRequestStatus(payload._id, RequestStatus.COMPLETED)
          return data;
        }
      } catch (error) {
        throw error
      }
    },
    async expireRequest(payload: IUpdateRequest) {
      try {
        const { status, data } = await client.put('/api/v1/requests/expire', payload);
        if (status === HTTP_STATUS.CREATED) {
          dispatch.requests.updateRequestStatus(payload._id, RequestStatus.EXPIRED)
          return data;
        }
      } catch (error) {
        throw error
      }
    },
    async fetchCustomerDetail(id: string) {
      try {
        const { status, data } = await client.post(`/api/v1/requests/customer`, { id });
        if (status === HTTP_STATUS.OK) {
          return data;
        }
      } catch (error) {
        throw error
      }
    },
    async sendSMS(payload: { id: string, message: string}) {
      try {
        const { status, data } = await client.post(`/api/v1/requests/sms`, payload);
        if (status === HTTP_STATUS.OK) {
          return data;
        }
      } catch (error) {
        throw error
      }
    }
  })
};