# Zurb Foundation templates
Zurb Foundation provides email templates and CSS stylesheets for responsive HTML email templates  ([Zurb Foundation](https://foundation.zurb.com/emails/email-templates.html)).

You'll find the base HTML and CSS currently used for EDGE email templates in the files below:
- foundation-html.html
- foundation-css.css

Update or create new templates as required and run them in the Zurb Web Inliner to create the final HTML markup (see below).

## Web Inliner
Inlining is the process of prepping an HTML email for delivery to email clients. Some email clients strip out your email's styles unless they are written inline with style tags.

**You might need to add some CSS rules that could have been stripped out by during inlining process (for example `:hover` selectors).** 

For example:

```
table.button:active table td,
table.button:hover table td,
table.button:visited table td {
  background-color:#062038 !important;
}

a:active,
a:hover {
  color: #062038
}
```
