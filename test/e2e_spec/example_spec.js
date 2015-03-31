'use strict';

describe('Application Homepage', function() {
  it('should display the welcome message', function() {
    browser.get('http://localhost:9000');

    var appName = element(by.css('div.jumbotron h1')); //using the CSS selector

    expect(appName.getText()).toEqual('Welcome to');
  });

});
