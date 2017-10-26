/**
 * Copyright (c) 2017, FinancialForce.com, inc
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 *   are permitted provided that the following conditions are met:
 *
 * - Redistributions of source code must retain the above copyright notice,
 *      this list of conditions and the following disclaimer.
 * - Redistributions in binary form must reproduce the above copyright notice,
 *      this list of conditions and the following disclaimer in the documentation
 *      and/or other materials provided with the distribution.
 * - Neither the name of the FinancialForce.com, inc nor the names of its contributors
 *      may be used to endorse or promote products derived from this software without
 *      specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 *  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
 *  THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS
 *  OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 *  OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 **/

public class HerokuConnector
{
	@TestVisible
	private static HerokuConnector instance = null;

	public static HerokuConnector newInstance()
	{
		if (instance == null)
		{
			instance = new HerokuConnector();
		}
		return instance;
	}

	public HttpResponse calculateRoute()
	{			
		return makeRequest('initialize');
	}

	public HttpResponse generateData()
	{			
		return makeRequest('createData');
	}

	private static HttpResponse makeRequest(String api)
	{
		Http http = new Http();
		HttpRequest request = new HttpRequest();
		request.setEndpoint('callout:Orizuru/api/' + api);
		request.setMethod('POST');
		populateHeader(request);
		return http.send(request);
	}

	private static void populateHeader(HttpRequest request)
	{
		request.setHeader('Authorization', 'Bearer ' + getSessionId());
		request.setHeader('Referer', Url.getSalesforceBaseUrl().toExternalForm());
		request.setHeader('Content-Type', 'application/json');
	}

	private static String getSessionId()
	{
		return UserInfo.getSessionId();
	}
}