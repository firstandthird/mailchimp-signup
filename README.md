# Mailchimp Signup UI

## Usage

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
