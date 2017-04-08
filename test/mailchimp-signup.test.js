import test from 'tape-rollup';
import MailchimpSignup from '../lib/mailchimp-signup';

const ENDPOINT = '/test/index.html';
const REF = '1234';

const init = () => {
  const container = document.createElement('div');
  container.id = 'domodule';
  document.body.appendChild(container);
};

const setup = text => {
  const container = document.getElementById('domodule');

  container.innerHTML = text || `
    <div data-module="MailchimpSubscribe">
      <form class="form" data-action="submit" data-action-type="submit" action="${ENDPOINT}">
        <div data-name="fields" class="form-elements">
          <input type="hidden" name="REF" value="${REF}"/>
          <input type="text" name="EMAIL">
          <button type="submit">Subscribe</button>
        </div>
        <span class="hide" data-name="submitMessage"></span>
      </form>
    </div>`;

  return MailchimpSignup.discover();
};

const getCallbackName = () => Object.keys(window)
  .filter(prop => prop.indexOf('jsonp_') === 0 && typeof window[prop] === 'function');

const getScripts = (url) => [].slice.call(document.querySelectorAll('script'))
  .filter(script => script.src.indexOf(url) > -1)
  .map(script => script.src);

const teardown = () => {
  delete window[getCallbackName()[0]];
};

init();

test('module register', assert => {
  assert.equal(typeof MailchimpSignup.modules, 'object');
  assert.equal(Object.keys(MailchimpSignup.modules).length, 1, 'one module registered');
  assert.end();
});

test('setup', assert => {
  assert.throws(() => {
    setup('<div data-module="MailchimpSubscribe"></div>');
  }, /submit is required as actions for MailchimpSubscribe, but is missing!/, 'action required');

  assert.throws(() => {
    setup(`<div data-module="MailchimpSubscribe">
            <form class="form" data-action="submit" data-action-type="submit" action="${ENDPOINT}">
            </form>
          </div>`);
  }, /submitMessage is required as named for MailchimpSubscribe, but is missing!/, 'submitMessage required');

  assert.throws(() => {
    setup(`<div data-module="MailchimpSubscribe">
            <form class="form" data-action="submit" data-action-type="submit" action="${ENDPOINT}">
            </form>
            <span class="font-large" data-name="submitMessage"></span>
          </div>`);
  }, /fields is required as named for MailchimpSubscribe, but is missing!/, 'fields required');

  assert.end();
});

test('submit', assert => {
  const modules = setup();
  const instance = modules[0];

  const form = document.querySelector('form');
  instance.submit(form, { preventDefault: () => {} });
  const callbackName = getCallbackName()[0];
  const endpoint = `${ENDPOINT}&REF=${REF}&EMAIL=&c=${callbackName}`;
  assert.equal(typeof window[callbackName], 'function', 'should have created a callback');
  assert.ok(getScripts(ENDPOINT)[0].indexOf(endpoint) > -1, 'should have a correctly formed jsonp query');

  assert.end();
  teardown();
});

test('callback', assert => {
  const modules = setup();
  const instance = modules[0];

  instance.displayResult({});
  assert.notOk(instance.els.fields.classList.contains('hide'), 'fields are not hidden');
  assert.equals(instance.els.submitMessage.textContent, 'Sorry. Unable to subscribe. Please try again later.', 'message should be default if not provided');
  assert.notOk(instance.els.submitMessage.classList.contains('hide'), 'message is shown');
  assert.end();
});

test('callback custom', assert => {
  const modules = setup(`<div data-module="MailchimpSubscribe" data-module-unable-message="Well, that's embarrassing">
      <form class="form" data-action="submit" data-action-type="submit" action="${ENDPOINT}">
        <div data-name="fields" class="form-elements">
          <input type="hidden" name="REF" value="${REF}"/>
          <input type="text" name="EMAIL">
          <button type="submit">Subscribe</button>
        </div>
        <span class="hide" data-name="submitMessage"></span>
      </form>
    </div>`);
  const instance = modules[0];

  instance.displayResult({});
  assert.notOk(instance.els.fields.classList.contains('hide'), 'fields are not hidden');
  assert.equals(instance.els.submitMessage.textContent, 'Well, that\'s embarrassing', 'custom message should be default if not provided');
  assert.notOk(instance.els.submitMessage.classList.contains('hide'), 'message is shown');
  assert.end();
});

test('callback - success', assert => {
  const modules = setup();
  const instance = modules[0];

  instance.displayResult({ result: 'success' });
  assert.equals(instance.els.submitMessage.textContent, 'Thank you!', 'should thank if result is successful');
  assert.end();
});

test('callback - custom success', assert => {
  const modules = setup(`<div data-module="MailchimpSubscribe" data-module-thank-message="Congratulations, you have been subscribed">
      <form class="form" data-action="submit" data-action-type="submit" action="${ENDPOINT}">
        <div data-name="fields" class="form-elements">
          <input type="hidden" name="REF" value="${REF}"/>
          <input type="text" name="EMAIL">
          <button type="submit">Subscribe</button>
        </div>
        <span class="hide" data-name="submitMessage"></span>
      </form>
    </div>`);
  const instance = modules[0];

  instance.displayResult({ result: 'success' });
  assert.equals(instance.els.submitMessage.textContent, 'Congratulations, you have been subscribed', 'should thank with custom message if result is successful');
  assert.end();
});

test('callback - error', assert => {
  const modules = setup();
  const instance = modules[0];

  instance.displayResult({ result: 'error', msg: 'already subscribed' });
  assert.equals(instance.els.submitMessage.textContent, 'You\'re already subscribed. Thank you.', 'should show a message if already subscribed');
  instance.displayResult({ result: 'error', msg: 'custom message' });
  assert.equals(instance.els.submitMessage.textContent, 'custom message', 'should show a custom message if given');
  assert.end();
});

test('callback - custom error', assert => {
  const modules = setup(`<div data-module="MailchimpSubscribe" 
              data-module-thank-message="Congratulations, you have been subscribed"
              data-module-already-message="You already did it">
      <form class="form" data-action="submit" data-action-type="submit" action="${ENDPOINT}">
        <div data-name="fields" class="form-elements">
          <input type="hidden" name="REF" value="${REF}"/>
          <input type="text" name="EMAIL">
          <button type="submit">Subscribe</button>
        </div>
        <span class="hide" data-name="submitMessage"></span>
      </form>
    </div>`);
  const instance = modules[0];

  instance.displayResult({ result: 'error', msg: 'already subscribed' });
  assert.equals(instance.els.submitMessage.textContent, 'You already did it', 'should show a custom message if already subscribed');
  instance.displayResult({ result: 'error', msg: 'custom message' });
  assert.equals(instance.els.submitMessage.textContent, 'custom message', 'should show a custom message if given');
  assert.end();
});
