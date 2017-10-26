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

'use strict';

const
	// get the debugger
	debug = require('debug-plus')('financialforcedev:orizuru:dataCreator'),

	// get the handler
	{ Handler } = require('@financialforcedev/orizuru'),

	// get the handling service
	dataCreator = require('./dataCreator/service'),

	// build transport
	transport = require('@financialforcedev/orizuru-transport-rabbitmq'),
	transportConfig = {
		cloudamqpUrl: process.env.CLOUDAMQP_URL
	},
	orizuruConfig = {
		transport,
		transportConfig
	},

	// define event schemas
	incomingSchema = require('../res/schema/createData'),

	// get handler and publisher
	handlerInstance = new Handler(orizuruConfig),

	// callback
	onHandleIncomingEvent = ({ message, context }) => {
		return dataCreator.createData(context);
	};

// listen and log error events on the handler
Handler.emitter.on(Handler.emitter.ERROR, debug.error);

// listen
handlerInstance.handle({
	schema: incomingSchema,
	callback: onHandleIncomingEvent
});