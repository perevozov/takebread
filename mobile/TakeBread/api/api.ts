/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface NewUser {
  email?: string;
  password?: string;
}

export interface LoginResult {
  sessionId?: string;
  /** Expiration date in the RFC3339 format */
  expires?: string;
}

export interface Item {
  id?: string;
  title: string;
}

export type ItemWithPosition = Item & {
  position?: number;
};

export interface List {
  id?: string;
  title: string;
}

export interface ListWithItems {
  id?: string;
  title: string;
  items?: ItemWithPosition[];
}

export type ListArray = List[];

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'https://takebread.hopto.org/api';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(
      typeof value === 'number' ? value : `${value}`,
    )}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      key => 'undefined' !== typeof query[key],
    );
    return keys
      .map(key =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${
        queryString ? `?${queryString}` : ''
      }`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? {'Content-Type': type}
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async response => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then(data => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch(e => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title TakeBread API
 * @version 1.0
 * @baseUrl https://takebread.hopto.org/api
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  register = {
    /**
     * @description Registers new user
     *
     * @name Register
     * @request POST:/register
     */
    register: (body: NewUser, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/register`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        ...params,
      }),
  };
  login = {
    /**
     * @description Authenticate user, creates session and sets session cookie
     *
     * @name Login
     * @request POST:/login
     */
    login: (
      body: {
        email?: string;
        password?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<LoginResult, any>({
        path: `/login`,
        method: 'POST',
        body: body,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  item = {
    /**
     * @description creates a new item
     *
     * @name CreateItem
     * @request POST:/item
     * @secure
     */
    createItem: (body: Item, params: RequestParams = {}) =>
      this.request<Item, any>({
        path: `/item`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description updates an existing item
     *
     * @name UpdateItem
     * @request PUT:/item
     * @secure
     */
    updateItem: (body: Item, params: RequestParams = {}) =>
      this.request<Item, any>({
        path: `/item`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description returns single item by its ID
     *
     * @name GetItem
     * @request GET:/item/{itemID}
     * @secure
     */
    getItem: (itemId: string, params: RequestParams = {}) =>
      this.request<Item, any>({
        path: `/item/${itemId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
  list = {
    /**
     * @description creates a new shopping list
     *
     * @name CreateLst
     * @request POST:/list
     * @secure
     */
    createLst: (body: List, params: RequestParams = {}) =>
      this.request<List, any>({
        path: `/list`,
        method: 'POST',
        body: body,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description updates a shopping list
     *
     * @name UpdateList
     * @request PUT:/list
     * @secure
     */
    updateList: (body: List, params: RequestParams = {}) =>
      this.request<List, any>({
        path: `/list`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),

    /**
     * @description return items list
     *
     * @name GetList
     * @request GET:/list/{listID}
     * @secure
     */
    getList: (listId: string, params: RequestParams = {}) =>
      this.request<ListWithItems, any>({
        path: `/list/${listId}`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),

    /**
     * @description adds new item to the list
     *
     * @name AddItem
     * @request PUT:/list/{listID}/item
     * @secure
     */
    addItem: (listId: string, body: Item, params: RequestParams = {}) =>
      this.request<ItemWithPosition, any>({
        path: `/list/${listId}/item`,
        method: 'PUT',
        body: body,
        secure: true,
        type: ContentType.Json,
        format: 'json',
        ...params,
      }),
  };
  lists = {
    /**
     * @description returns lists of all items lists for the user
     *
     * @name ListLists
     * @request GET:/lists
     * @secure
     */
    listLists: (params: RequestParams = {}) =>
      this.request<ListArray, any>({
        path: `/lists`,
        method: 'GET',
        secure: true,
        format: 'json',
        ...params,
      }),
  };
}
