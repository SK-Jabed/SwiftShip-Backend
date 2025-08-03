import { ParcelStatus } from "./parcel.interface";

export const VALID_STATUS_TRANSITIONS: Record<ParcelStatus, ParcelStatus[]> =
  {
    [ParcelStatus.REQUESTED]: [
      ParcelStatus.APPROVED,
      ParcelStatus.CANCELLED,
    ],
    [ParcelStatus.APPROVED]: [
      ParcelStatus.PICKED_UP,
      ParcelStatus.CANCELLED,
    ],
    [ParcelStatus.PICKED_UP]: [
      ParcelStatus.IN_TRANSIT,
      ParcelStatus.CANCELLED,
    ],
    [ParcelStatus.IN_TRANSIT]: [
      ParcelStatus.DELIVERED,
      ParcelStatus.CANCELLED,
      ParcelStatus.BLOCKED,
      ParcelStatus.RETURNED,
      ParcelStatus.RESCHEDULED,
    ],
    [ParcelStatus.RESCHEDULED]: [
      ParcelStatus.IN_TRANSIT,
      ParcelStatus.CANCELLED,
    ],
    [ParcelStatus.BLOCKED]: [
      ParcelStatus.RESCHEDULED,
      ParcelStatus.RETURNED,
    ],
    [ParcelStatus.RETURNED]: [], 
    [ParcelStatus.DELIVERED]: [], 
    [ParcelStatus.CANCELLED]: [], 
  };

export const parcelSearchTable = ["status", "location"];