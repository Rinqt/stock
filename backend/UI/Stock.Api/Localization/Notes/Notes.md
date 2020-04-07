When new translation needs to be added, it should be added to all langauges with the specified key that needs to be the same in all languages and translation for the specific language. New key needs to be added to [Keys class](/Core/Stock.Utilities/Globalization/Keys.cs) as well. If the message is dynamic, meaning it has some values that need to be injected during runtime, it can be specified using curly braces -> {}. e.g *My name is `{name}`*. Value inside curly braces is not important. Later, the key will be used like:

```
Globalization.Messages.Get(Keys.SomeKey, Language.En)
```

Language by default is English and does not need to be specified.

If you need to inject some values during runtime, the key for message 

*My name is `{name}` and my surname is `{surname}`.*

will be used like:

```
Globalization.Messages.Get(Keys.SomeKey, "John", "Doe").
```

**Correct number of dynamic parameters is important!**

If however you need to use another language, you can specify it explicitly like:

```
Globalization.Messages.Get(Keys.SomeKey, Language.Cz, "John", "Doe").
```