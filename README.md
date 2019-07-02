# Mailchimp Signup UI ![npm](https://img.shields.io/npm/v/@firstandthird/mailchimp-signup.svg) [![Build Status](https://travis-ci.org/firstandthird/mailchimp-signup.svg?branch=master)](https://travis-ci.org/firstandthird/mailchimp-signup)

## Installation

```sh
npm install @firstandthird/mailchimp-signup
```

## Usage

### JavaScript

```js
import '@firstandthird/mailchimp-signup'
// or
import MailchimpSignup, { MailchimpSubscribeEvents as Events } from '@firstandthird/mailchimp-signup'
```

### HTML

```html
<div data-module="MailchimpSubscribe">
  <form class="form" data-action="submit" data-action-type="submit" action="[ENDPOINT]">
    <div data-name="fields" class="form-elements">
      <input type="text" name="EMAIL">
      <button type="submit">Subscribe</button>
    </div>
    <span class="hide" data-name="submitMessage"></span>
  </form>
</div>
```

## Endpoint

Endpoint is in the form:

```
//[account name].us6.list-manage.com/subscribe/post-json?u=[user id]&id=[list id]
```
