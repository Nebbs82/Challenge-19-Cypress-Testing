import React from'react'
import { mount } from 'cypress/react'
import Quiz from '../../client/src/components/Quiz'

describe('Quiz Component', () => {
  // beforeEach block runs before each test case
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      url: '/api/questions/random',
    }, {
      fixture: 'questions.json', // Use the questions from the questions.json fixture
      statusCode: 200,
    }).as('getQuestions') // Assign a name to the intercepted request
    cy.mount(<Quiz />) // Mount the Quiz component
  })

  // Test case: Verify the start button exists on page load
  it('should display the start button on page load', () => {
    cy.get('button').contains('Start Quiz').should('exist') // Check if the "Start Quiz" button exists
  })

  // Test case: Verify the first question is displayed after clicking the start button
  it('should display the first question upon clicking the start button', () => {
    cy.get('button').contains('Start Quiz').click() // Click the "Start Quiz" button
    cy.wait('@getQuestions') // Wait for the questions to be fetched
    cy.get('h2').contains("What is the output of print(2 ** 3)?").should('exist') // Check if the first question exists
    cy.get('div.alert').should('have.length', 4) // Check if there are 4 alert elements
    cy.get('div.alert').contains('6').should('exist') // Check if the option '6' exists
    cy.get('div.alert').contains('8').should('exist') // Check if the option '8' exists
  })

  // Test case: Verify the second question is displayed after clicking the submit button
  it('should display the second question upon clicking the submit button', () => {
    cy.get('button').contains('Start Quiz').click() // Click the "Start Quiz" button
    cy.get('button').contains('1').click() // Select an answer for the first question
    cy.get('h2').contains("Which of the following is a mutable data type in Python?").should('exist') // Check if the second question exists
    cy.get('div.alert').should('have.length', 4) // Check if there are 4 alert elements
    cy.get('div.alert').contains('str').should('exist') // Check if the option'str' exists
    cy.get('div.alert').contains('tuple').should('exist') // Check if the option 'tuple' exists
  })

  // Test case: Verify the quiz is completed and results are displayed
  it('should display quiz completed and test results with a button to a start new test', () => {
    cy.get('button').contains('Start Quiz').click() // Click the "Start Quiz" button
    cy.get('button').contains('1').click() // Select an answer for the first question
    cy.get('button').contains('1').click() // Select an answer for the second question
    cy.get('h2').contains('Quiz Completed').should('exist') // Check if the "Quiz Completed" heading exists
  })

  // Test case: Verify the quiz can be restarted by clicking the "Take New Quiz" button
  it('should click the try again button to see the test start over at question one', () => {
    cy.get('button').contains('Start Quiz').click() // Click the "Start Quiz" button
    cy.get('button').contains('1').click() // Select an answer for the first question
    cy.get('button').contains('1').click() // Select an answer for the second question
    cy.get('button').contains('Take New Quiz').click() // Click the "Take New Quiz" button
    cy.get('h2').contains("What is the output of print(2 ** 3)?").should('exist') // Check if the first question is displayed after restarting the quiz
  })
})