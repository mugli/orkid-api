/**
 * This file was automatically generated by Nexus 0.9.11
 * Do not make changes to this file directly
 */




declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenRootTypes {
  ActionStatus: { // root type
    success?: boolean | null; // Boolean
  }
  DeadList: {};
  ErrorLog: { // root type
    message?: string | null; // String
    name?: string | null; // String
    stack?: string | null; // String
  }
  FailedList: {};
  Mutation: {};
  Query: {};
  Queue: { // root type
    active?: boolean | null; // Boolean
    name: string; // String!
    taskCount: number; // Int!
    tasks?: NexusGenRootTypes['Task'][] | null; // [Task!]
    workerCount: number; // Int!
  }
  ResultList: {};
  Stat: { // root type
    dead: number; // Int!
    enqueued: number; // Int!
    failed: number; // Int!
    retries: number; // Int!
    total: number; // Int!
  }
  Task: { // root type
    at?: string | null; // String
    data?: string | null; // String
    dedupKey?: string | null; // String
    error?: NexusGenRootTypes['ErrorLog'] | null; // ErrorLog
    id?: string | null; // String
    qname?: string | null; // String
    result?: string | null; // String
    retryCount?: number | null; // Int
  }
  String: string;
  Int: number;
  Float: number;
  Boolean: boolean;
  ID: string;
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
}

export interface NexusGenFieldTypes {
  ActionStatus: { // field return type
    success: boolean | null; // Boolean
  }
  DeadList: { // field return type
    taskCount: number; // Int!
    tasks: NexusGenRootTypes['Task'][] | null; // [Task!]
  }
  ErrorLog: { // field return type
    message: string | null; // String
    name: string | null; // String
    stack: string | null; // String
  }
  FailedList: { // field return type
    taskCount: number; // Int!
    tasks: NexusGenRootTypes['Task'][] | null; // [Task!]
  }
  Mutation: { // field return type
    allActive: boolean | null; // Boolean
    deleteQueue: NexusGenRootTypes['ActionStatus'] | null; // ActionStatus
    pauseAll: NexusGenRootTypes['ActionStatus'] | null; // ActionStatus
    resumeAll: NexusGenRootTypes['ActionStatus'] | null; // ActionStatus
  }
  Query: { // field return type
    deadList: NexusGenRootTypes['DeadList'] | null; // DeadList
    failedList: NexusGenRootTypes['FailedList'] | null; // FailedList
    queue: NexusGenRootTypes['Queue'] | null; // Queue
    queueNames: string[] | null; // [String!]
    resultList: NexusGenRootTypes['ResultList'] | null; // ResultList
    stat: NexusGenRootTypes['Stat'] | null; // Stat
  }
  Queue: { // field return type
    active: boolean | null; // Boolean
    name: string; // String!
    taskCount: number; // Int!
    tasks: NexusGenRootTypes['Task'][] | null; // [Task!]
    workerCount: number; // Int!
  }
  ResultList: { // field return type
    taskCount: number; // Int!
    tasks: NexusGenRootTypes['Task'][] | null; // [Task!]
  }
  Stat: { // field return type
    dead: number; // Int!
    enqueued: number; // Int!
    failed: number; // Int!
    retries: number; // Int!
    total: number; // Int!
  }
  Task: { // field return type
    at: string | null; // String
    data: string | null; // String
    dedupKey: string | null; // String
    error: NexusGenRootTypes['ErrorLog'] | null; // ErrorLog
    id: string | null; // String
    qname: string | null; // String
    result: string | null; // String
    retryCount: number | null; // Int
  }
}

export interface NexusGenArgTypes {
  DeadList: {
    tasks: { // args
      limit?: number | null; // Int
      offset?: number | null; // Int
    }
  }
  FailedList: {
    tasks: { // args
      limit?: number | null; // Int
      offset?: number | null; // Int
    }
  }
  Query: {
    queue: { // args
      name: string; // String!
    }
  }
  Queue: {
    tasks: { // args
      limit?: number | null; // Int
      offset?: number | null; // Int
    }
  }
  ResultList: {
    tasks: { // args
      limit?: number | null; // Int
      offset?: number | null; // Int
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "ActionStatus" | "DeadList" | "ErrorLog" | "FailedList" | "Mutation" | "Query" | "Queue" | "ResultList" | "Stat" | "Task";

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}