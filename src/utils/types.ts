export interface ICurrentUsers {
  name: string;
  id: string;
  isDmExisting: boolean;
  dmID: string;
}

export interface ICurrentGroups {
  groupName: string;
  id: string;
}

export interface IGroupDetails {
  groupName: string;
  users?: { id: string; userName: string }[];
  chat?: { userId: string; message: string; userName: string }[];
  isDm: boolean;
}

export interface IGroupProps {
  open: boolean;
  handleClose: () => void;
  currentGroups: ICurrentGroups[];
  addUserToGroup: (id:string) => void;
}

export interface IMemberProps {
    open: boolean;
    handleClose: () => void;
    members: { id: string; userName: string }[];
}
export interface IAddGroupProps {
    open: boolean;
    handleClose: () => void;
    addGroup: (groupName: string, isDm: boolean, uniqueId2: string | null) => void;
}
