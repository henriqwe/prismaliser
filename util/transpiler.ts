import { api, _gtools_lib } from "./tools";

const code =
  "schema locadora (\n" +
  "  enabled\n" +
  ") {\n" +
  "  entity veiculos (\n" +
  "    concurrencyControl\n" +
  "    businessRule\n" +
  "    accessControl (\n" +
  "      read [\n" +
  "        PUBLIC\n" +
  "        ADMIN\n" +
  "      ]\n" +
  "      write [\n" +
  "        ADMIN\n" +
  "      ]\n" +
  "    )\n" +
  "    persistence (\n" +
  "      uniqueKey [\n" +
  "        nome\n" +
  "      ]\n" +
  "      indexKey [\n" +
  "        marca\n" +
  "      ]\n" +
  "    )\n" +
  "  ) {\n" +
  "    marca (\n" +
  "      String 12\n" +
  "      unique\n" +
  "      nullable\n" +
  "      comment 'test'\n" +
  "    )\n" +
  "  }\n" +
  "  entity unidade (\n" +
  "    !concurrencyControl\n" +
  "    businessRule\n" +
  "    accessControl (\n" +
  "      read [\n" +
  "        PUBLIC\n" +
  "      ]\n" +
  "      write [\n" +
  "        ADMIN\n" +
  "      ]\n" +
  "    )\n" +
  "    persistence (\n" +
  "      uniqueKey [\n" +
  "        identificador\n" +
  "      ]\n" +
  "      indexKey [\n" +
  "      ]\n" +
  "    )\n" +
  "  ) {\n" +
  "    identificador (\n" +
  "      String 12\n" +
  "      unique\n" +
  "      !nullable\n" +
  "      comment 'testing comments'\n" +
  "    )\n" +
  "  }\n" +
  "}\n";

const ycl_reserved_words = [
  "schema",
  "entity",
  "enabled",
  "extends",
  "nullable",
  "unique",
  "concurrencyControl",
  "businessRule",
  "accessControl",
  "read",
  "write",
  "persistence",
  "uniqueKey",
  "indexKey",
  "String",
  "Boolean",
  "Integer",
  "Long",
  "Double",
  "Number",
  "Date",
  "Time",
  "Text",
  "File",
  "_conf",
  "extension",
  "source",
  "nosql",
  "dataset",
  "timeseries",
  "columnar",
  "partitionKeys",
  "clusteringColumns",
  "Text",
  "id",
  "role",
  "user",
  "createdat",
  "updatedat",
  "version",
];

export const ycl_transpiler = {
  refs: {},
  types: [
    "String",
    "Boolean",
    "Integer",
    "Long",
    "Double",
    "Number",
    "Date",
    "Text",
    "Time",
    "Timestamp",
    "Text",
    "File",
    "Image",
    "Binary",
  ],
  ycl_reserved_word_contains(token) {
    for (let index = 0; index < ycl_reserved_words.length; index++)
      if (ycl_reserved_words[index].trim() == token.trim()) return true;

    return false;
  },
  tokenizer_yc_code(text, entity_names_) {
    const tokens_ = [];
    const lines = text.split("\n");
    for (let line = 0; line < lines.length; line++) {
      if (lines[line].includes(","))
        if (
          !lines[line].startsWith("[") &&
          !lines[line].endsWith("]") &&
          !lines[line].startsWith("(") &&
          !lines[line].endsWith(")") &&
          !lines[line].startsWith("{") &&
          !lines[line].endsWith("}")
        ) {
          lines[line] = lines[line].replaceAll(" ", "").replaceAll(",", " ");
          const aux = lines[line].trim().split(" ");
          if (!ycl_transpiler.ycl_reserved_word_contains(aux[0])) {
            // go!
          } else
            throw new Error(
              "error: malformed syntax. the token found is a reserved word."
            );
        } else throw new Error("error: malformed list syntax.");

      const positions = lines[line].trim().split(" ");
      for (let position = 0; position < positions.length; position++)
        if (positions[position].trim() != "") {
          tokens_[tokens_.length] = {
            symbol: positions[position].trim(),
            line: line + 1,
            position: position + 1,
          };
          if (positions[position].trim() == "entity") {
            const entity_name_ = positions[position + 1].trim();
            if (
              !ycl_transpiler.ycl_reserved_word_contains(entity_name_) &&
              ycl_transpiler.check_schema_object_name(entity_name_)
            )
              if (entity_names_.includes(entity_name_))
                throw new Error(
                  `error: model inconsistency. entity name '${entity_name_}' duplicated.`
                );
              else entity_names_.push(entity_name_);
          }
        }
    }
    return tokens_;
  },
  parse(src) {
    let schema = {};
    let actual_entity = {};
    let actual_attribute = {};

    let code = "";

    const entity_names = [];
    const tokens = ycl_transpiler.tokenizer_yc_code(src, entity_names);
    let code_body = "";
    let index = 0;
    let from = 0;

    ycl_transpiler.refs = {};

    while (index < tokens.length)
      if (from == 0 && tokens[index].symbol == "schema") {
        {
          /*
           * o nome do schema pode estar precedido de c: ou d:
           *
           */
          const aux = tokens[index + 1].symbol.split(":");
          if (aux.length == 2)
            schema = {
              name: aux[1],
              command: aux[0],
              _conf: [],
              entities: [],
            };
          else
            schema = {
              name: aux[0],
              command: "",
              _conf: [],
              entities: [],
            };
        }
        if (
          !ycl_transpiler.ycl_reserved_word_contains(schema.name) &&
          ycl_transpiler.check_schema_object_name(schema.name)
        ) {
          /*
           * reconhecer a declaração de schema
           *
           */
          code = `${code + tokens[index].symbol} ${schema.name} `;
          index++;
          index++;
          from = 1;
        } else
          throw new Error(
            `error: the token format is not lowercase, or matches some reserved word, or does not match only alpha characters. token '${
              tokens[index + 1].symbol
            }', line ${tokens[index + 1].line}, position: ${
              tokens[index + 1].position
            }. [from: ${from}]`
          );
      } else if (
        from == 1 &&
        tokens[index].symbol == "(" &&
        (tokens[index + 1].symbol == "enabled" ||
          tokens[index + 1].symbol == "!enabled" ||
          tokens[index + 1].symbol == "u:enabled" ||
          tokens[index + 1].symbol == "u:!enabled") &&
        tokens[index + 2].symbol.startsWith("'") &&
        tokens[index + 2].symbol.endsWith("'") &&
        tokens[index + 3].symbol.startsWith("'") &&
        tokens[index + 3].symbol.endsWith("'") &&
        tokens[index + 4].symbol == ")"
      ) {
        /*
         * reconhecer a declaração de configuracao de schema e a operação que,
         * eventualmente seja necessária realizar
         *
         */
        {
          const aux = tokens[index + 1].symbol.split(":");
          if (aux.length == 2)
            schema._conf = {
              enabled: {
                value: !aux[1].startsWith("!"),
                command: "u",
              },
            };
          else
            schema._conf = {
              enabled: {
                value: !aux[0].startsWith("!"),
                command: "",
              },
            };
        }
        code =
          `${code}(\n` +
          `  ${tokens[index + 1].symbol.replace("u:", "")}\n  ${
            tokens[index + 2].symbol
          } \n  ${tokens[index + 3].symbol} \n)`;
        index += 5;
        from = 2;
      } else if (
        from == 1 &&
        tokens[index].symbol == "(" &&
        tokens[index + 1].symbol.startsWith("'") &&
        tokens[index + 1].symbol.endsWith("'") &&
        (tokens[index + 2].symbol == "enabled" ||
          tokens[index + 2].symbol == "!enabled" ||
          tokens[index + 2].symbol == "u:enabled" ||
          tokens[index + 2].symbol == "u:!enabled") &&
        tokens[index + 3].symbol == ")"
      ) {
        /*
         * reconhecer a declaração de configuracao de schema e a operação que,
         * eventualmente seja necessária realizar
         *
         */
        {
          const aux = tokens[index + 2].symbol.split(":");
          if (aux.length == 2)
            schema._conf = {
              enabled: {
                value: !aux[1].startsWith("!"),
                command: "u",
              },
            };
          else
            schema._conf = {
              enabled: {
                value: !aux[0].startsWith("!"),
                command: "",
              },
            };
        }
        code =
          `${code}(\n` +
          `  ${tokens[index + 2].symbol.replace("u:", "")}\n  ${
            tokens[index + 1].symbol
          } \n)`;
        code =
          `${code}(\n` +
          `  ${tokens[index + 2].symbol.replace("u:", "")}\n  ${
            tokens[index + 1].symbol
          }\n  ${tokens[index + 3].symbol} \n)`;
        index += 3;
        from = 2;
      } else if (from == 1 && tokens[index].symbol == "{")
        /*
         * encaminhar para reconhecer a declaração de corpo de schema
         *
         */
        from = 2;
      else if (
        from == 2 &&
        tokens[index].symbol == "{" &&
        tokens[tokens.length - 1].symbol == "}"
      ) {
        code += " {\nBODY}";
        index++;
        from = 3;
      } else if (from == 3 && tokens[index].symbol == "entity") {
        {
          /* o nome do schema pode estar precedido de c: ou d: */
          const aux = tokens[index + 1].symbol.split(":");
          if (aux.length == 2)
            actual_entity = {
              name: aux[1],
              command: aux[0],
              _conf: {
                dbType: "sql",
                businessRule: false,
                concurrencyControl: false,
                accessControl: {
                  read: ["ADMIN"],
                  write: ["ADMIN"],
                },
                uniqueKey: [],
                indexKey: [],
              },
              attributes: [],
            };
          else
            actual_entity = {
              name: aux[0],
              command: "",
              _conf: {
                dbType: "sql",
                businessRule: false,
                concurrencyControl: false,
                accessControl: {
                  read: ["ADMIN"],
                  write: ["ADMIN"],
                },
                uniqueKey: [],
                indexKey: [],
              },
              attributes: [],
            };
        }
        if (
          !ycl_transpiler.ycl_reserved_word_contains(actual_entity.name) &&
          ycl_transpiler.check_schema_object_name(actual_entity.name)
        ) {
          schema.entities.push(actual_entity);
          if (actual_entity.command == "d") {
            index++;
            while (++index < tokens.length) {
              if (tokens[index].symbol == "(") {
                while (tokens[++index].symbol != ")")
                  if (tokens[index].symbol == "sql") {
                    ycl_transpiler.db_type = tokens[index].symbol;
                    actual_entity._conf.dbType = ycl_transpiler.db_type;
                  } else if (tokens[index].symbol == "nosql") {
                    ycl_transpiler.db_type = "nosql(columnar)";
                    actual_entity._conf.dbType = ycl_transpiler.db_type;
                  }

                ++index;
              }
              if (tokens[index].symbol == "}")
                if (tokens[index + 1].symbol == "entity") {
                  // avaliar se após a declaração de remoção da entidade vem outra entidade
                  // ou encerra-se a declaração de schema
                  from = 3;
                  index++;
                  break;
                } else if (tokens[index + 1].symbol == "}") {
                  from = 6;
                  index++;
                  break;
                }
            }
            if (index == tokens.length)
              throw new Error(
                "error: neither a next entity was found, nor the end of the code after the entity declared to be delete."
              );
          } else {
            code_body = `${code_body}  ${tokens[index].symbol} ${tokens[
              index + 1
            ].symbol
              .replace("c:", "")
              .replace("d:", "")}`;
            index++;
            index++;
            from = 4;
          }
        } else
          throw new Error(
            `error: the token format is not lowercase, or matches some reserved word, or does not match only alpha characters. token '${
              tokens[index + 1].symbol
            }', line ${tokens[index + 1].line}, position: ${
              tokens[index + 1].position
            }. [from: ${from}]`
          );
      } else if (from == 4 && tokens[index].symbol == "(") {
        // <<<<<<< PODE Ñ SER (, ou seja vir {. tratar isso!
        code_body = `${code_body} ${tokens[index].symbol} \n`;
        index++;
        while (tokens[index].symbol != ")")
          if (tokens[index].symbol == "sql") {
            ycl_transpiler.db_type = tokens[index].symbol;
            actual_entity._conf.dbType = ycl_transpiler.db_type;
            code_body = `${code_body}    ${tokens[index].symbol}\n`;
            index++;
          } else if (tokens[index].symbol == "nosql") {
            ycl_transpiler.db_type = tokens[index].symbol;
            actual_entity._conf.dbType = ycl_transpiler.db_type;
            code_body = `${code_body}    ${tokens[index].symbol}`;
            if (tokens[++index].symbol == "(") {
              code_body = `${code_body} ${tokens[index].symbol}`;
              if (
                tokens[++index].symbol == "columnar" ||
                tokens[index].symbol == "document"
              ) {
                actual_entity._conf.dbType = ycl_transpiler.db_type
                  .concat("(")
                  .concat(tokens[index].symbol)
                  .concat(")");
                code_body = `${code_body} ${tokens[index].symbol}`;
                if (tokens[++index].symbol == ")")
                  code_body = `${code_body} ${tokens[index].symbol}`;
                else
                  throw new Error(
                    `error: unexpected token '${tokens[index].symbol}'. the expected token is ')'`
                  );
              } else
                throw new Error(
                  `error: unexpected token '${tokens[index].symbol}'. the expected token is 'columnar' or 'graph'`
                );
            }
            code_body += "\n";
            index++;
          } else if (
            tokens[index].symbol == "concurrencyControl" ||
            tokens[index].symbol == "!concurrencyControl" ||
            tokens[index].symbol == "u:concurrencyControl" ||
            tokens[index].symbol == "u:!concurrencyControl"
          ) {
            {
              const aux = tokens[index].symbol.split(":");
              if (aux.length == 2)
                actual_entity._conf.concurrencyControl = {
                  value: aux[1].startsWith("c"),
                  command: aux[0],
                };
              else
                actual_entity._conf.concurrencyControl = {
                  value: aux[0].startsWith("c"),
                  command: "",
                };
            }
            code_body = `${code_body}    ${tokens[index].symbol.replace(
              "u:",
              ""
            )}\n`;
            index++;
          } else if (
            tokens[index].symbol == "businessRule" ||
            tokens[index].symbol == "!businessRule" ||
            tokens[index].symbol == "u:businessRule" ||
            tokens[index].symbol == "u:!businessRule"
          ) {
            {
              const aux = tokens[index].symbol.split(":");
              if (aux.length == 2)
                actual_entity._conf.businessRule = {
                  value: aux[1].startsWith("b"),
                  command: aux[0],
                };
              else
                actual_entity._conf.businessRule = {
                  value: aux[0].startsWith("b"),
                  command: "",
                };
            }
            code_body = `${code_body}    ${tokens[index].symbol.replace(
              "u:",
              ""
            )}\n`;
            index++;
          } else if (
            actual_entity._conf.dbType.startsWith("nosql") &&
            tokens[index].symbol == "source" &&
            tokens[index + 1].symbol == "("
          ) {
            code_body = `${code_body}    ${tokens[index].symbol} ${
              tokens[++index].symbol
            }\n`;
            code_body = `${code_body}      ${tokens[++index].symbol}\n`;
            actual_entity._conf.source = {
              value: tokens[index].symbol,
              command: "",
            };
            if (tokens[++index].symbol == ")")
              code_body = `${code_body}    ${tokens[index].symbol}\n`;
            else
              throw new Error(
                `error: unexpected token '${tokens[index].symbol}'. the expected token is ')'`
              );
            index++;
          } else if (
            actual_entity._conf.dbType.startsWith("nosql") &&
            (tokens[index].symbol == "extension" ||
              tokens[index].symbol == "u:extension") &&
            tokens[index + 1].symbol == "("
          ) {
            {
              const aux = tokens[index].symbol.split(":");
              if (aux.length == 2)
                actual_entity._conf.extension = {
                  value: "",
                  command: aux[0],
                };
              else
                actual_entity._conf.extension = {
                  value: "",
                  command: "",
                };
            }
            code_body = `${code_body}    ${tokens[index].symbol.replace(
              "u:",
              ""
            )} ${tokens[++index].symbol}\n`;
            index++;
            while (tokens[index].symbol != ")") {
              actual_entity._conf.extension.value = `${
                actual_entity._conf.extension.value + tokens[index].symbol
              }\n`;
              code_body = `${code_body}      ${tokens[index].symbol}\n`;
              index++;
            }
            code_body = `${code_body}    ${tokens[index].symbol}\n`;
            index++;
          } else if (
            actual_entity._conf.dbType == "sql" &&
            (tokens[index].symbol == "uniqueKey" ||
              tokens[index].symbol == "u:uniqueKey") &&
            tokens[index + 1].symbol == "["
          ) {
            code_body = `${code_body}    ${tokens[index].symbol.replace(
              "u:",
              ""
            )} ${tokens[index + 1].symbol}\n`;
            actual_entity._conf.uniqueKey = {
              values: [],
              command: "",
            };
            if (tokens[index].symbol.startsWith("u:"))
              actual_entity._conf.uniqueKey.command = "u";

            index++;
            index++;
            while (tokens[index].symbol != "]")
              if (
                !ycl_transpiler.ycl_reserved_word_contains(
                  tokens[index].symbol
                ) &&
                ycl_transpiler.check_schema_object_name(tokens[index].symbol)
              ) {
                actual_entity._conf.uniqueKey.values.push(tokens[index].symbol);
                code_body = `${code_body}      ${tokens[index].symbol}\n`;
                index++;
              } else
                throw new Error(
                  `error: attribute name incorrect into uniqueKey. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                );

            code_body = `${code_body}    ${tokens[index].symbol}\n`; // o ']' do 'uniqueKey ['
            index++;
          } else if (
            actual_entity._conf.dbType.startsWith("nosql") &&
            tokens[index].symbol == "uniqueKey" &&
            tokens[index + 1].symbol == "("
          ) {
            code_body = `${code_body}    ${tokens[index].symbol} ${
              tokens[++index].symbol
            }\n`;
            actual_entity._conf.uniqueKey = {
              partitionKeys: {
                values: [],
              },
              clusteringColumns: {
                values: [],
              },
            };
            let flag = true,
              hasPK = false;
            index++;
            while (flag)
              if (
                tokens[index].symbol == "partitionKeys" &&
                tokens[index + 1].symbol == "["
              ) {
                code_body = `${code_body}      ${tokens[index].symbol} ${
                  tokens[++index].symbol
                }\n`;
                index++;
                while (tokens[index].symbol != "]")
                  if (
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol
                    ) &&
                    ycl_transpiler.check_schema_object_name(
                      tokens[index].symbol
                    )
                  ) {
                    actual_entity._conf.uniqueKey.partitionKeys.values.push(
                      tokens[index].symbol
                    );
                    code_body = `${code_body}        ${tokens[index].symbol}\n`;
                    index++;
                    hasPK = true;
                  } else
                    throw new Error(
                      `error: attribute name incorrect into uniqueKey. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                    );

                if (
                  actual_entity._conf.uniqueKey.partitionKeys.values.length == 0
                )
                  throw new Error("error: you must defined a primary key");

                code_body = `${code_body}      ${tokens[index].symbol}\n`; // o ']' do 'partitionKeys ['
                index++;
              } else if (
                tokens[index].symbol == "clusteringColumns" &&
                tokens[index + 1].symbol == "["
              ) {
                code_body = `${code_body}      ${tokens[index].symbol} ${
                  tokens[++index].symbol
                }\n`;
                index++;
                while (tokens[index].symbol != "]")
                  if (
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol
                    ) &&
                    ycl_transpiler.check_schema_object_name(
                      tokens[index].symbol
                    )
                  ) {
                    actual_entity._conf.uniqueKey.clusteringColumns.values.push(
                      tokens[index].symbol
                    );
                    code_body = `${code_body}        ${tokens[index].symbol}\n`;
                    index++;
                    hasPK = true;
                  } else
                    throw new Error(
                      `error: attribute name incorrect into uniqueKey. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                    );

                code_body = `${code_body}      ${tokens[index].symbol}\n`; // o ']' do 'clusteringColumns ['
                index++;
              } else flag = false;

            if (!hasPK) throw new Error("error: primary key undefined");

            if (tokens[index].symbol == ")")
              code_body = `${code_body}    ${tokens[index].symbol}\n`;
            // o ')' do 'primaryKey ('
            else
              throw new Error(
                `error: unexpected token '${tokens[index].symbol}' (in line: ${tokens[index].line}). the expected token is ')'`
              );
            index++;
          } else if (
            (tokens[index].symbol == "indexKey" ||
              tokens[index].symbol == "u:indexKey") &&
            tokens[index + 1].symbol == "["
          ) {
            code_body = `${code_body}    ${tokens[index].symbol.replace(
              "u:",
              ""
            )} ${tokens[index + 1].symbol}\n`;
            actual_entity._conf.indexKey = {
              values: [],
              command: "",
            };
            if (tokens[index].symbol.startsWith("u:"))
              actual_entity._conf.indexKey.command = "u";

            index++;
            index++;
            while (tokens[index].symbol != "]")
              if (
                !ycl_transpiler.ycl_reserved_word_contains(
                  tokens[index].symbol
                ) &&
                ycl_transpiler.check_schema_object_name(tokens[index].symbol)
              ) {
                actual_entity._conf.indexKey.values.push(tokens[index].symbol);
                code_body = `${code_body}      ${tokens[index].symbol}\n`;
                index++;
              } else
                throw new Error(
                  `error: attribute name incorrect into indexKey. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                );

            code_body = `${code_body}    ${tokens[index].symbol}\n`; // o ']' do 'indexKey ['
            index++;
          } else if (
            (tokens[index].symbol == "accessControl" ||
              tokens[index].symbol == "u:accessControl") &&
            tokens[index + 1].symbol == "("
          ) {
            actual_entity._conf.accessControl = {
              read: {
                values: [],
                command: "",
              },
              write: {
                values: [],
                command: "",
              },
              command: "",
            };
            if (tokens[index].symbol.startsWith("u:"))
              actual_entity._conf.accessControl.command = "u";

            code_body = `${code_body}    ${tokens[index].symbol.replace(
              "u:",
              ""
            )} ${tokens[++index].symbol}\n`;
            index++;
            while (tokens[index].symbol != ")")
              if (
                tokens[index].symbol == "read" &&
                tokens[index + 1].symbol == "["
              ) {
                code_body = `${code_body}      ${tokens[index].symbol} ${
                  tokens[++index].symbol
                }\n`;
                index++;
                while (tokens[index].symbol != "]")
                  if (
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol
                    ) &&
                    ycl_transpiler.is_role_name_ok(tokens[index].symbol) &&
                    tokens[index].symbol.length > 2
                  ) {
                    actual_entity._conf.accessControl.read.values.push(
                      tokens[index].symbol
                    );
                    code_body = `${code_body}        ${tokens[index].symbol}\n`;
                    index++;
                  } else
                    throw new Error(
                      `error: token format is not capitalized, or matches some reserved word, or does not start with length gt 2. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                    );

                code_body = `${code_body}      ${tokens[index].symbol}\n`; // o ']' do 'read ['
                index++;
              } else if (
                tokens[index].symbol == "write" &&
                tokens[index + 1].symbol == "["
              ) {
                code_body = `${code_body}      ${tokens[index].symbol} ${
                  tokens[++index].symbol
                }\n`;
                index++;
                while (tokens[index].symbol != "]")
                  if (
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol
                    ) &&
                    ycl_transpiler.is_role_name_ok(tokens[index].symbol) &&
                    tokens[index].symbol.length > 2
                  ) {
                    actual_entity._conf.accessControl.write.values.push(
                      tokens[index].symbol
                    );
                    code_body = `${code_body}        ${tokens[index].symbol}\n`;
                    index++;
                  } else
                    throw new Error(
                      `error: token format is not capitalized, or matches some reserved word, or does not start with length gt 2. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                    );

                code_body = `${code_body}      ${tokens[index].symbol}\n`; // o ']' do 'write ['
                index++;
              } else
                throw new Error(
                  `error: unknow token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                );

            code_body = `${code_body}    ${tokens[index].symbol}\n`; // o ')' do 'accessControl ('
            index++;
          } else if (
            actual_entity._conf.dbType.equals("sql") &&
            tokens[index].symbol.startsWith("u:") &&
            !ycl_transpiler.ycl_reserved_word_contains(
              tokens[index].symbol.split(":")[1]
            ) &&
            ycl_transpiler.check_schema_object_name(
              tokens[index].symbol.split(":")[1]
            )
          ) {
            const aux = tokens[index].symbol.split(":");
            if (aux.length == 2)
              actual_entity._conf.name = {
                value: aux[1],
                command: "u",
              };
            else
              throw new Error(
                `error: unknow token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
              );

            // code_body = code_body + '    ' + tokens[index].symbol.replace('u:','') + '\n';
            index++;
          } else
            throw new Error(
              `error: unknow token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
            );

        code_body = `${code_body}  ${tokens[index].symbol}`; // o ')' do 'accessControl ('
        index++;
        from = 5;
      } else if (from == 5 && tokens[index].symbol == "{") {
        code_body = `${code_body} ${tokens[index].symbol}\n`;
        /*
         * avaliar o corpo de uma entidade
         */
        index++;
        while (tokens[index].symbol != "}") {
          {
            let aux = tokens[index].symbol;
            if (aux.startsWith("c:") || aux.startsWith("d:")) {
              aux = aux.split(":");
              actual_attribute = {
                name: aux[1],
                command: aux[0],
                _conf: {},
              };
            } else
              actual_attribute = {
                name: aux,
                command: "",
                _conf: {},
              };
          }
          if (
            !ycl_transpiler.ycl_reserved_word_contains(actual_attribute.name) &&
            ycl_transpiler.check_schema_object_name(actual_attribute.name)
          ) {
            actual_entity.attributes.push(actual_attribute);
            if (actual_attribute.command == "d") {
              index++;
              if (tokens[index].symbol == "(") {
                let count = 0;
                while (++index < tokens.length)
                  if (tokens[index].symbol == "(") count++;
                  else if (count == 0 && tokens[index].symbol == ")") {
                    index++;
                    break;
                  } else if (tokens[index].symbol == ")") count--;

                if (index == tokens.length)
                  throw new Error(
                    "error: neither a next attribute was found, nor the end of the code after the attribute declared to be delete."
                  );
              } else {
                /** começo da delcaração do attributo seguinte. index dispensa incremento */
              }
            } else {
              code_body = `${code_body}    ${tokens[index].symbol
                .replace("c:", "")
                .replace("d:", "")}`;
              index++;
              if (tokens[index].symbol == "(") {
                code_body = `${code_body} ${tokens[index].symbol}\n`;
                index++;
                while (tokens[index].symbol != ")")
                  if (
                    tokens[index].symbol == "unique" ||
                    tokens[index].symbol == "!unique" ||
                    tokens[index].symbol == "u:unique" ||
                    tokens[index].symbol == "u:!unique"
                  ) {
                    {
                      const aux = tokens[index].symbol.split(":");
                      if (aux.length == 2)
                        actual_attribute._conf.unique = {
                          value: aux[1] == "unique",
                          command: aux[0],
                        };
                      else
                        actual_attribute._conf.unique = {
                          value: aux[0] == "unique",
                          command: "",
                        };
                    }
                    code_body = `${code_body}      ${tokens[
                      index
                    ].symbol.replace("u:", "")}\n`;
                    index++;
                  } else if (
                    tokens[index].symbol == "nullable" ||
                    tokens[index].symbol == "!nullable" ||
                    tokens[index].symbol == "u:nullable" ||
                    tokens[index].symbol == "u:!nullable"
                  ) {
                    {
                      const aux = tokens[index].symbol.split(":");
                      if (aux.length == 2)
                        actual_attribute._conf.nullable = {
                          value: aux[1] == "nullable",
                          command: aux[0],
                        };
                      else
                        actual_attribute._conf.nullable = {
                          value: aux[0] == "nullable",
                          command: "",
                        };
                    }
                    code_body = `${code_body}      ${tokens[
                      index
                    ].symbol.replace("u:", "")}\n`;
                    index++;
                  } else if (
                    ycl_transpiler.db_type == "nosql" &&
                    (tokens[index].symbol == "source" ||
                      tokens[index].symbol == "u:source") &&
                    tokens[index + 1].symbol == "("
                  ) {
                    actual_attribute._conf.source = {
                      value: {},
                      command: "",
                    };
                    if (tokens[index].symbol.startsWith("u:"))
                      actual_attribute._conf.source.command = "u";

                    code_body = `${code_body}      ${tokens[
                      index
                    ].symbol.replace("u:", "")} ${tokens[++index].symbol}\n`;
                    code_body = `${code_body}        ${
                      tokens[++index].symbol
                    }\n`;
                    actual_attribute._conf.source.value.url =
                      tokens[index].symbol;
                    code_body = `${code_body}        ${
                      tokens[++index].symbol
                    }\n`;
                    actual_attribute._conf.source.value.field =
                      tokens[index].symbol;
                    if (tokens[++index].symbol == ")")
                      code_body = `${code_body}      ${tokens[index].symbol}\n`;
                    else
                      throw new Error(
                        `error: unexpected token '${tokens[index].symbol}' (in line: ${tokens[index].line}). the expected token is ')'`
                      );
                    index++;
                  } else if (
                    ycl_transpiler.db_type == "nosql" &&
                    (tokens[index].symbol == "extension" ||
                      tokens[index].symbol == "u:extension") &&
                    tokens[index + 1].symbol == "("
                  ) {
                    actual_attribute._conf.extension = {
                      value: "",
                      command: "",
                    };
                    if (tokens[index].symbol.startsWith("u:"))
                      actual_attribute._conf.extension.command = "u";

                    code_body = `${code_body}      ${tokens[
                      index
                    ].symbol.replace("u:", "")} ${tokens[++index].symbol}\n`;
                    index++;
                    while (tokens[index].symbol != ")") {
                      code_body = `${code_body}        ${tokens[index].symbol}\n`;
                      actual_attribute._conf.extension.value = `${
                        actual_attribute._conf.extension.value +
                        tokens[index].symbol
                      }\n`;
                      index++;
                    }
                    code_body = `${code_body}      ${tokens[index].symbol}\n`;
                    index++;
                  } else if (
                    (tokens[index].symbol == "comment" ||
                      tokens[index].symbol == "u:comment") &&
                    tokens[index + 1].symbol.startsWith("'") &&
                    tokens[index + 1].symbol.endsWith("'")
                  ) {
                    actual_attribute._conf.comment = {
                      value: "",
                      command: "",
                    };
                    if (tokens[index].symbol.startsWith("u:"))
                      actual_attribute._conf.comment.command = "u";

                    code_body = `${code_body}      ${tokens[
                      index
                    ].symbol.replace("u:", "")} ${tokens[++index].symbol}\n`;
                    actual_attribute._conf.comment.value = tokens[index].symbol;
                    index++;
                  } else if (
                    tokens[index].symbol == "comment" &&
                    tokens[index + 1].symbol.startsWith("'") &&
                    !tokens[index + 1].symbol.endsWith("'")
                  ) {
                    actual_attribute._conf.comment = {
                      value: "",
                      command: "",
                    };
                    if (tokens[index].symbol.startsWith("u:"))
                      actual_attribute._conf.comment.command = "u";

                    code_body = `${code_body}      ${tokens[
                      index
                    ].symbol.replace("u:", "")} '${tokens[
                      ++index
                    ].symbol.replace("'", "")}`;
                    actual_attribute._conf.comment.value = `${tokens[index].symbol}\n`;
                    index++;
                    while (!tokens[index].symbol.endsWith("'")) {
                      code_body = `${code_body} ${tokens[index].symbol}`;
                      actual_attribute._conf.comment.value = `${
                        actual_attribute._conf.comment.value +
                        tokens[index].symbol
                      }\n`;
                      index++;
                    }

                    if (tokens[index].symbol.length == 1)
                      code_body = `${code_body + tokens[index].symbol}\n`;
                    else
                      code_body = `${
                        code_body + " ".concat(tokens[index].symbol)
                      }\n`;

                    index++;
                  } else if (
                    ycl_transpiler.types.includes(
                      tokens[index].symbol.split(":")[
                        tokens[index].symbol.split(":").length - 1
                      ]
                    )
                  ) {
                    const symbol = tokens[index].symbol.split(":");
                    actual_attribute._conf.type = {
                      value: symbol[symbol.length - 1],
                      command: "",
                    };
                    if (symbol.length == 2)
                      actual_attribute._conf.type.command =
                        symbol[symbol.length - 2];

                    if (symbol[symbol.length - 1] == "String")
                      if (!isNaN(tokens[index + 1].symbol)) {
                        code_body = `${code_body}      ${
                          symbol[symbol.length - 1]
                        } ${tokens[++index].symbol}\n`;
                        actual_attribute._conf.length = tokens[index].symbol;
                        index++;
                      } else if (
                        ycl_transpiler.types.includes(
                          tokens[index + 1].symbol
                        ) ||
                        tokens[index + 1].symbol == "unique" ||
                        tokens[index + 1].symbol == "!unique" ||
                        tokens[index + 1].symbol == "nullable" ||
                        tokens[index + 1].symbol == "!nullable" ||
                        tokens[index + 1].symbol == "comment" ||
                        tokens[index + 1].symbol == ")"
                      ) {
                        code_body = `${code_body}      ${tokens[index].symbol}\n`;
                        index++;
                      } else
                        throw new Error(
                          `error: unknow token. token '${
                            tokens[index + 1].symbol
                          }', line ${tokens[index + 1].line}, position: ${
                            tokens[index + 1].position
                          }. [from: ${from}]`
                        );
                    else if (symbol[symbol.length - 1] == "Time")
                      if (!isNaN(tokens[index + 1].symbol)) {
                        code_body = `${code_body}      ${
                          symbol[symbol.length - 1]
                        } ${tokens[++index].symbol}\n`;
                        if (
                          Number(tokens[index].symbol) == 4 ||
                          Number(tokens[index].symbol) == 6
                        )
                          actual_attribute._conf.length = tokens[index].symbol;
                        else
                          throw new Exception(
                            `error: time precision error. token '${
                              tokens[index + 1].symbol
                            }', line ${tokens[index + 1].line}, position: ${
                              tokens[index + 1].position
                            }. [from: ${from}]`
                          );

                        index++;
                      } else if (
                        ycl_transpiler.types.includes(
                          tokens[index + 1].symbol
                        ) ||
                        tokens[index + 1].symbol == "unique" ||
                        tokens[index + 1].symbol == "!unique" ||
                        tokens[index + 1].symbol == "nullable" ||
                        tokens[index + 1].symbol == "!nullable" ||
                        tokens[index + 1].symbol == "comment" ||
                        tokens[index + 1].symbol == ")"
                      ) {
                        code_body = `${code_body}      ${tokens[index].symbol}\n`;
                        index++;
                      } else
                        throw new Error(
                          `error: unknow token. token '${
                            tokens[index + 1].symbol
                          }', line ${tokens[index + 1].line}, position: ${
                            tokens[index + 1].position
                          }. [from: ${from}]`
                        );
                    else {
                      code_body = `${code_body}      ${
                        symbol[symbol.length - 1]
                      }\n`;
                      index++;
                    }
                  } else if (entity_names.includes(tokens[index].symbol)) {
                    if (!ycl_transpiler.refs[tokens[index].symbol])
                      ycl_transpiler.refs[tokens[index].symbol] = [];

                    ycl_transpiler.refs[tokens[index].symbol].push({
                      entity_name: actual_entity.name,
                      attribute_name: actual_attribute.name,
                      attribute_command: actual_attribute.command,
                    });

                    /*
                     * reconhece aqui a entidade da associação
                     *
                     */
                    actual_attribute._conf.type = {
                      value: tokens[index].symbol,
                      command: "",
                    };
                    actual_attribute._conf.nullable = false;
                    code_body = `${code_body}      ${tokens[index].symbol}\n`;
                    index++;
                  } else if (
                    actual_entity._conf.dbType == "sql" &&
                    tokens[index].symbol.startsWith("u:") &&
                    !ycl_transpiler.ycl_reserved_word_contains(
                      tokens[index].symbol.split(":")[1]
                    ) &&
                    ycl_transpiler.check_schema_object_name(
                      tokens[index].symbol.split(":")[1]
                    )
                  ) {
                    {
                      const aux = tokens[index].symbol.split(":");
                      if (aux.length == 2)
                        actual_attribute._conf.name = {
                          value: aux[1],
                          command: "u",
                        };
                      else
                        throw new Error(
                          `error: unknow token. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                        );
                    }
                    code_body = `${code_body}      ${tokens[
                      index
                    ].symbol.replace("u:", "")}\n`;
                    index++;
                  } else
                    throw new Error(
                      `error: unknow token. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
                    );

                code_body = `${code_body}    ${tokens[index].symbol}\n`;
                index++;
              } else code_body += "\n";
            }
          } else
            throw new Error(
              `error: token matches some reserved word or length is less than 2. token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
            );
        }
        code_body = `${code_body}  ${tokens[index].symbol}\n`; // o '}' do 'entity <name> {'
        index++;
        from = 3;
      } else if (from == 4 && tokens[index].symbol == "{") from = 5;
      else {
        if (tokens.length - 1 == index) console.log("code ok");
        else
          throw new Error(
            `* error: unknow token '${tokens[index].symbol}', line ${tokens[index].line}, position: ${tokens[index].position}. [from: ${from}]`
          );

        index++;
      }

    /* 
                 a - b
                  \ /
                   c
                   |
                   d

              a - a_b - b
                a_c b_c
                   c
                  c_d
                   d

                 (a_b):
                 [a,b]
              a.b     b.a
              a.c     b.c
     (a_c):  >   \   /  >  (b_c):
     [a,c]        c.a      [b,c]
                  c.b
                  c.d
                   |  >  (c_d):
                  d.c    [c,d]

                a: {
                    
                }
                a_b: {
                    b_var:b,
                    a_var:a
                }
                b: {
                    
                }

               (a.b,b.a)
             -a.b    -b.a
             -a.c    -b.c
   (a.c,c.a)  >  \   /  >  (b.c,c.b):
                 -c.a      
                 -c.b
                 -c.d
                   |  >  (c.d,d.c) 
                  d.c  
                  */

    let flag = true;
    const toRemove = [];
    const refs = [];
    const targets = Object.keys(ycl_transpiler.refs); // [a, b, c, d]
    // console.log('targets: ', targets);
    for (let target_idx = 0; target_idx < targets.length; target_idx++) {
      // [0, 1, 2, 3]
      // console.log('target_idx: ', target_idx);
      const target = targets[target_idx]; // a < [0:a, 1:b, 2:c, 3:d]
      // console.log('target: ', target);
      const sources = ycl_transpiler.refs[target]; // [b, c, b]
      // console.log('sources: ', sources);
      for (let source_idx = 0; source_idx < sources.length; source_idx++) {
        // [0, 1, 2]
        // console.log('source_idx: ', source_idx);
        const source = sources[source_idx]; // b < [0:b, 1:c, 2:b]
        // console.log('source: ', source);
        if (ycl_transpiler.refs[source.entity_name]) {
          // true
          // console.log('source "', source, '" validated');
          const sources_ = ycl_transpiler.refs[source.entity_name]; // [c, a, a]
          // console.log('sources_: ', sources_);
          for (
            let source_idx_ = 0;
            source_idx_ < sources_.length;
            source_idx_++
          ) {
            // [0, 1, 2]
            // console.log('source_idx_: ', source_idx_);
            const refTarget = sources_[source_idx_].entity_name; // c < [0:c, 1:a, 2:a], a < [0:c, 1:a, 2:a], a < [0:c, 1:a, 2:a]
            // console.log('refTarget: ', refTarget);
            // console.log(refTarget+' == '+target+': '+(refTarget == target));
            if (refTarget == target) {
              // false, true, true
              refs.push({
                source: Object(source), // b
                target: String(target), // a
              });

              let entity_idx = 0;
              const attribute_idx = 0;
              for (
                ;
                entity_idx < schema.entities.length && flag;
                entity_idx++
              ) {
                const entity = schema.entities[entity_idx];
                if (source.entity_name == entity.name) {
                  let attribute_idx = 0;
                  for (
                    ;
                    attribute_idx < entity.attributes.length && flag;
                    attribute_idx++
                  ) {
                    const attribute = entity.attributes[attribute_idx];
                    if (source.attribute_name == attribute.name) {
                      flag = false;
                      break;
                    }
                  }
                }
              }
              toRemove.push({
                entity_idx,
                attribute_idx,
              });
            }
          }
        }
      }
    }

    /* if (flag) {
            throw new Error('error: inconsistency detected into nm relationship.');
        } else {
            console.log('> toRemove: ',toRemove)
            for (let idx = 0; idx < toRemove.length; idx++) {
                let item = toRemove[idx];
                delete schema.entities[item.entity_idx].attributes[item.attribute_idx];
            }
        }*/

    const { entities } = schema;
    for (let ref_idx = 0; ref_idx < refs.length; ref_idx++) {
      const ref = refs[ref_idx];

      let associationEntityName = "aewe";
      if (ref.source.entity_name > ref.target)
        associationEntityName = associationEntityName
          .concat(ref.target)
          .concat(ref.source.entity_name);
      else
        associationEntityName = associationEntityName
          .concat(ref.source.entity_name)
          .concat(ref.target);

      associationEntityName = String(associationEntityName.concat("ewea"));

      let hasEntity = false;
      for (
        let entity_idx = 0;
        entity_idx < entities.length && !hasEntity;
        entity_idx++
      ) {
        const entity = entities[entity_idx];
        if (entity.name == associationEntityName)
          if (Object.keys(entity.attributes).length == 1) {
            hasEntity = true;
            entity._conf.uniqueKey.push(ref.source.attribute_name);
            entity.attributes.push({
              name: String(ref.source.attribute_name),
              command: "",
              _conf: {
                type: String(ref.target),
                nullable: false,
              },
            });
          } else
            throw new Error(
              "error: association between entities is inconsistency."
            );
      }

      if (!hasEntity) {
        const associationEntity = {
          command: "c",
          name: associationEntityName,
          _conf: {
            dbType: "sql",
            businessRule: false,
            concurrencyControl: false,
            indexKey: [],
            uniqueKey: [String(ref.source.attribute_name)],
            accessControl: {
              read: [],
              write: [],
            },
          },
          attributes: [
            {
              name: String(ref.source.attribute_name),
              command: "",
              _conf: {
                type: String(ref.target),
                nullable: false,
              },
            },
          ],
        };

        for (
          let entity_idx = 0;
          entity_idx < entities.length && !hasEntity;
          entity_idx++
        ) {
          const entity = entities[entity_idx];
          if (
            entity.name == ref.target ||
            entity.name == ref.source.entity_name
          ) {
            for (
              let read_idx = 0;
              read_idx < entity._conf.accessControl.read.length;
              read_idx++
            )
              if (
                !associationEntity._conf.accessControl.read.includes(
                  entity._conf.accessControl.read[read_idx]
                )
              )
                associationEntity._conf.accessControl.read.push(
                  entity._conf.accessControl.read[read_idx]
                );

            for (
              let write_idx = 0;
              write_idx < entity._conf.accessControl.write.length;
              write_idx++
            )
              if (
                !associationEntity._conf.accessControl.write.includes(
                  entity._conf.accessControl.write[write_idx]
                )
              )
                associationEntity._conf.accessControl.write.push(
                  entity._conf.accessControl.write[write_idx]
                );
          }
        }

        schema.entities.push(associationEntity);
      }
    }

    console.log("schema: ", schema);

    return { code: code.replace("BODY", code_body), schema, src };
  },
  check_schema_object_name(str) {
    return str.match(/^[a-z0-9]{2,}$/);
  },
};

// let response = ycl_transpiler.parse(__code);
// document.querySelector('pre').innerHTML = response.code;
// console.log(response.code);*/
// console.log(response.schema);
// ycl_transpiler.deploy(response.schema, function () {});
