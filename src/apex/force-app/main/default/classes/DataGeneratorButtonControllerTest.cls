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
 */

@isTest(SeeAllData=false)
private class DataGeneratorButtonControllerTest
{
	@IsTest
	private static void generateData_ShouldCallTheHerokuConnectorGenerateDataMethod()
	{
		// Given
		StubProvider mocks = new StubProvider();

		HerokuConnectorForSampleApp mockConnector = (HerokuConnectorForSampleApp)mocks.mock(HerokuConnectorForSampleApp.class);
		HerokuConnectorForSampleApp.instance = mockConnector;

		mocks.stub(mockConnector, 'generateData', new Type[]{ String.class }, new Object[]{ 'Test' }, null);

		// When
		DataGeneratorButtonController.generateData('Test');

		// Then
		System.assertEquals(1, mocks.getCallCount(mockConnector, 'generateData', new Type[]{ String.class }, new Object[]{ 'Test' }));
	}

	@IsTest
	private static void getTaskStatus_withId_shouldReturnTaskComplete()
	{
		// Given
		String expectedResult = 'NOT STARTED';
		
		GenerateDataTask__c task = new GenerateDataTask__c();
		insert task;

		// When
		String result = DataGeneratorButtonController.getTaskStatus(task.id);

		// Then
		System.assertEquals(expectedResult, result);
	}

	@IsTest
	private static void sendInitialPlatformEvent_withId_shouldReturnSuccess()
	{
		// Given
		GenerateDataTask__c task = new GenerateDataTask__c();
		insert task;

		// When
		Test.startTest();
		Boolean result = DataGeneratorButtonController.sendInitialPlatformEvent(task.id);
		Test.stopTest();

		// Then
		System.assertEquals(true, result);
	}
}
