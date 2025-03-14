# custom-patcher

`custom-patcher` is a CLI tool for patching the version of your application. It provides multiple options to control verbosity and execution speed.

## Installation

Install globally via npm:

```sh
npm install -g custom-patcher
```

Or using Yarn:

```sh
yarn global add custom-patcher
```

## Usage

Run `custom-patcher` with the desired arguments:

```sh
custom-patcher
```

### Arguments

- `-h`, `--help`: Show help. Default: `false`.
- `--version`: Show CLI version number.
- `-v`, `--verbose`: Turn on verbose logging mode. Default: `false`.
- `-q`, `--quick`: Turn on low interaction mode. Default: `false`.

### Examples

Simple example:

```sh
custom-patcher
```

Enable verbose logging:

```sh
custom-patcher -v
```

Low interaction (quick) mode:

```sh
custom-patcher -q
```

Display help:

```sh
custom-patcher -h
```

## License

MIT License

