/**
 * MIT License
 *
 * Copyright (c) 2022 Jerad Rutnam (www.jeradrutnam.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
**/

export interface httpRequestObjectInterface {
    accessToken: string;
    configData: any;
    header?: string;
    payload?: string;
    url: string;
}

export interface httpCallStackInterface {
    ["httpRequestInstanceID"]: string,
    ["resolve"]: any,
    ["reject"]: any
}

export const HTTPMethods = {
    GET: "GET",
    POST: "POST"
}

export type HTTPMethodType =
    | typeof HTTPMethods.GET
    | typeof HTTPMethods.POST;

export const HTTPFetchError = "Cannot reach the endpoint";
export const HTTPNoAuthenticationSessionError = "No authentication session";
export const HTTPAuthorizationRequiredError = "Authorization is required before making secure API requests";

export const HTTPErrors = {
    400: "BadRequest",
    401: "Unauthorized",
    402: "PaymentRequired",
    403: "Forbidden",
    404: "NotFound",
    405: "MethodNotAllowed",
    406: "NotAcceptable",
    407: "ProxyAuthenticationRequired",
    408: "RequestTimeout",
    409: "Conflict",
    410: "Gone",
    411: "LengthRequired",
    412: "PreconditionFailed",
    413: "PayloadTooLarge",
    414: "URITooLong",
    415: "UnsupportedMediaType",
    416: "RangeNotSatisfiable",
    417: "ExpectationFailed",
    418: "ImATeapot",
    421: "MisdirectedRequest",
    422: "UnprocessableEntity",
    423: "Locked",
    424: "FailedDependency",
    425: "TooEarly",
    426: "UpgradeRequired",
    428: "PreconditionRequired",
    429: "TooManyRequests",
    431: "RequestHeaderFieldsTooLarge",
    451: "UnavailableForLegalReasons",
    500: "InternalServerError",
    501: "NotImplemented",
    502: "BadGateway",
    503: "ServiceUnavailable",
    504: "GatewayTimeout",
    505: "HTTPVersionNotSupported",
    506: "VariantAlsoNegotiates",
    507: "InsufficientStorage",
    508: "LoopDetected",
    509: "BandwidthLimitExceeded",
    510: "NotExtended",
    511: "NetworkAuthenticationRequired"
}
