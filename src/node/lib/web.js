/**
 * Copyright (c) 2017-2018, FinancialForce.com, inc
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

'use strict';

const
	// get the debugger
	debug = require('debug-plus')('financialforcedev:orizuru:web'),

	// add modules for including static default route
	path = require('path'),
	express = require('express'),

	// get default route
	DEFAULT_ROUTE = express.static(path.join(__dirname, 'web/static')),

	// get the server
	{ json, Server } = require('@financialforcedev/orizuru'),

	// get the auth
	auth = require('@financialforcedev/orizuru-auth').middleware,

	// define the environment for authentication
	authenticationEnv = {
		jwtSigningKey: process.env.JWT_SIGNING_KEY,
		openidClientId: process.env.OPENID_CLIENT_ID,
		openidHTTPTimeout: parseInt(process.env.OPENID_HTTP_TIMEOUT, 10),
		openidIssuerURI: process.env.OPENID_ISSUER_URI
	},

	// get the transport
	{ Transport } = require('@financialforcedev/orizuru-transport-rabbitmq'),

	// configure the transport
	transport = new Transport({
		url: process.env.CLOUDAMQP_URL
	}),

	// get schemas
	schemaNameToDefinition = require('./web/schema'),

	// define the endpoint ( in this case: /api/{schemaname} )
	apiEndpoint = '/api/',

	// define middleware (in order of usage)
	middleware = [json(), auth.tokenValidator(authenticationEnv), auth.grantChecker(authenticationEnv)],

	// create the server
	server = new Server({
		port: parseInt(process.env.PORT, 10),
		transport
	});

// listen and log error events on the authenticator
auth.emitter.on('denied', debug.error);

server
	.on(Server.ERROR, debug.error)
	.on(Server.INFO, debug)
	.addRoute({
		endpoint: apiEndpoint,
		middleware,
		schema: schemaNameToDefinition.calculateRoutesForPlan
	})
	.addRoute({
		endpoint: apiEndpoint,
		middleware,
		schema: schemaNameToDefinition.createData
	})
	.use('/', DEFAULT_ROUTE)
	.listen();
