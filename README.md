# Mailchimp Signup UI

Example html

```html
<div data-module="MailchimpSubscribe">
  <form class="form" data-action="submit" data-action-type="submit" action="${ENDPOINT}">
    <div data-name="fields" class="form-elements">
      <input type="hidden" name="REF" value="${REF}"/>
      <input type="text" name="EMAIL">
      <button type="submit">Subscribe</button>
    </div>
    <span class="hide" data-name="submitMessage"></span>
  </form>
</div>
```
