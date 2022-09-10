/*
{"password":"1234567","username":"tester@academia"}
tester@biblioteca   OXrrnKZgQ2jgEEon
tester@natalnet  RP2AhXDO0AiDL46v

{
  "dcovid": [{
    "file":"covid.csv",
    "mode": "all",
    "delimiter": ",",
    "map":{
      "cases":"casos"
    }
  }]
}
 */

const PROTOCOL = "https";
const baas_address = "api.ycodify.com";
export const api = {
  credentials: {
    password: "",
    username: "tester",
  },
  endpoint: {
    auth: {
      url: `${PROTOCOL}://${baas_address}/v0/auth/oauth/token`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic ".concat(
          btoa("yc:c547d72d-607c-429c-81e2-0baec7dd068b")
        ),
      },
      httpMessageType: "POST",
    },
    account: {
      create: {
        url: `${PROTOCOL}://${baas_address}/v0/id/account`,
        headers: {
          "X-TenantID": "",
          "Content-Type": "application/json",
        },
        httpMessageType: "POST",
      },
      update: {
        url: `${PROTOCOL}://${baas_address}/v0/id/account/username/{username}/version/{version}`,
        headers: {
          "X-TenantID": "",
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer {TOKEN}",
        },
        httpMessageType: "PUT",
      },
      updatePassword: {
        url: `${PROTOCOL}://${baas_address}/v0/id/account/username/{username}/version/{version}/update-password`,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer {TOKEN}",
        },
        httpMessageType: "PUT",
      },
    },
    igrid: {
      log: {
        error: {
          get: {
            url: `${PROTOCOL}://${baas_address}/v0/r-monitor/log/error/operation/{operation}/time/{time}/{op}`,
            headers: {
              Authorization: "Bearer {TOKEN}",
              "X-TenantID": "",
              Accept: "application/json",
            },
            httpMessageType: "GET",
          },
        },
      },
    },
    backend: {
      ds: {
        data_backup: {
          url: `${PROTOCOL}://${baas_address}/v0/ds/data-bakcup`,
          headers: {
            "X-TenantID": "",
            "Content-Type": "application/json",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "POST",
        },
        data_restore: {
          url: `${PROTOCOL}://${baas_address}/v0/ds/project-owner/{projectOwner}/project-name/{projectName}/data-restore`,
          headers: {
            "X-TenantID": "",
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "POST",
        },
        schema_populate: {
          url: `${PROTOCOL}://${baas_address}/v0/ds-nosql/project-owner/{projectOwner}/project-name/{projectName}/entity-name/{entityName}/onrm/insert/batch`,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "POST",
        },
      },
      account: {
        create: {
          url: `${PROTOCOL}://${baas_address}/v0/id/account/create`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
        get_all: {
          url: `${PROTOCOL}://${baas_address}/v0/id/account/get-all`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
        get: {
          url: `${PROTOCOL}://${baas_address}/v0/id/account/get`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
        update: {
          url: `${PROTOCOL}://${baas_address}/v0/id/account/update`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
        updatePassword: {
          url: `${PROTOCOL}://${baas_address}/v0/id/account/update-password`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
      },
      role: {
        create: {
          url: `${PROTOCOL}://${baas_address}/v0/id/role/create`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer {TOKEN}",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
        get_all: {
          url: `${PROTOCOL}://${baas_address}/v0/id/role/get-all`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer {TOKEN}",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
        get_one: {
          url: `${PROTOCOL}://${baas_address}/v0/id/role/get`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer {TOKEN}",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
        update: {
          url: `${PROTOCOL}://${baas_address}/v0/id/role/update`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer {TOKEN}",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
        delete: {
          url: `${PROTOCOL}://${baas_address}/v0/id/role/delete`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer {TOKEN}",
            "X-TenantID": "{TenantID}",
          },
          httpMessageType: "POST",
        },
      },
    },
    modeling: {
      parser: {
        parse: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/parser/parse`,
          headers: {
            "Content-Type": "text/plain",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "POST",
        },
        generate_cli: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/parser/generate-cli`,
          headers: {
            "Content-Type": "text/plain",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "POST",
        },
        generate_scripts: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/parser/generate-scripts/{script-type}`,
          headers: {
            "Content-Type": "text/plain",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "POST",
        },
        reverse: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/type/{type}/parser/reverse`,
          headers: {
            Authorization: "Bearer {TOKEN}",
            Accept: "text/plain",
          },
          httpMessageType: "GET",
        },
      },
      schema: {
        tagged: {
          create: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/tag-with/{tag}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "POST",
          },
          get: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/tagged-by/{tag}`,
            headers: {
              Accept: "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "GET",
          },
          get_all: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/taggeds`,
            headers: {
              Accept: "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "GET",
          },
          delete: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/tagged-by/{tag}`,
            headers: {
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "DELETE",
          },
        },
        create: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "POST",
        },
        read: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}`,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "GET",
        },
        read_all: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/detailed`,
          headers: {
            Accept: "application/json",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "GET",
        },
        update: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "PUT",
        },
        delete: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "DELETE",
        },
        caa: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/create-admin-account`,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "POST",
        },
        yumlCD: {
          url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/for-graphical-view/show-attributes/{showAttributes}`,
          headers: {
            Accept: "text/plain",
            Authorization: "Bearer {TOKEN}",
          },
          httpMessageType: "GET",
        },
        entity: {
          create: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "POST",
          },
          createNoSQL: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/nosql-columnar/entity`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "POST",
          },
          read: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "POST",
          },
          update: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "PUT",
          },
          updateNoSQL: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/nosql-columnar/entity/{entityName}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "PUT",
          },
          delete: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "DELETE",
          },
          deleteNoSQL: {
            url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/nosql-columnar/entity/{entityName}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer {TOKEN}",
            },
            httpMessageType: "DELETE",
          },
          attribute: {
            create: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}/attribute`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "POST",
            },
            update: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}/attribute/{attributeName}`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "PUT",
            },
            delete: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}/attribute/{attributeName}`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "DELETE",
            },
            createNoSQL: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/nosql-columnar/entity/{entityName}/attribute`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "POST",
            },
            updateNoSQL: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/nosql-columnar/entity/{entityName}/attribute/{attributeName}`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "PUT",
            },
            deleteNoSQL: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/nosql-columnar/entity/{entityName}/attribute/{attributeName}`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "DELETE",
            },
          },
          relationship: {
            create: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}/association`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "POST",
            },
            update: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}/association/{relationshipName}`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "PUT",
            },
            delete: {
              url: `${PROTOCOL}://${baas_address}/v0/modeling/project-name/{projectName}/schema/sql/entity/{entityName}/association/{relationshipName}/type/{relationshipType}`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer {TOKEN}",
              },
              httpMessageType: "DELETE",
            },
          },
        },
      },
    },
  },
  query: {
    action: 1,
    object: null,
    criterion: {
      connective: "AND",
      toCount: false,
      orderBy: "titulo",
      order: "asc",
      maxRegisters: 20,
      firstRegister: 0,
    },
    associations: {
      mode: false,
      level: 0,
    },
  },
  livro: null,
};

export const _gtools_lib = {
  type: {
    Java: [
      "String",
      "Long",
      "Timestamp",
      "Boolean",
      "Integer",
      "Double",
      "Date",
    ],
  },
  copy_clipboard(id, value) {
    if (id) {
      const element = document.getElementById(id);
      element.select();
      text = new String(element.value);
    }

    const $temp = $("<input>");
    $("body").append($temp);
    $temp.val(value).select();
    document.execCommand("copy");
    $temp.remove();
  },
  date_format(date) {
    const _date = new Date(date);
    const dd = String(_date.getDate()).padStart(2, "0");
    const mm = String(_date.getMonth() + 1).padStart(2, "0");
    const yyyy = _date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  },
  populate(frm, data) {
    $.each(data, function (key, value) {
      $(`[name=${key}]`, frm).val(value);
    });
  },
  request(endpoint, data, callback, type) {
    const xhttp = new XMLHttpRequest();
    if (type == "login") {
      /* callback({
                http: {
                    status: 200
                },
                data: JSON.stringify({
                    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJ0ZXN0ZXIiLCJzY29wZSI6WyJyZWFkIiwid3JpdGUiXSwibmFtZSI6bnVsbCwiaWQiOjg5LCJleHAiOjE2NTkwMTg5MDYsImF1dGhvcml0aWVzIjpbIlJPTEVfQ0xJRU5UIl0sImp0aSI6ImU5MmIwN2QzLTNiOTgtNGE0MS1hYmYzLTc2NWE1OGQxZWVjNCIsImVtYWlsIjoidGVzdGVyQHljLmNvbSIsImNsaWVudF9pZCI6InljIiwidXNlcm5hbWUiOiJ0ZXN0ZXIiLCJzdGF0dXMiOjF9.ltC3w9vqyhnPypKkeR-ZoeC6ciuvf7cimgWRSoYS80E",
                    username: 'tester'
                })
            });
            return;
            /* */

      xhttp.open(endpoint.httpMessageType, endpoint.url, true);
      xhttp.setRequestHeader("Content-Type", endpoint.headers["Content-Type"]);
      xhttp.setRequestHeader("Authorization", endpoint.headers.Authorization);
      xhttp.send(data);
    } else {
      if (
        endpoint.httpMessageType == "POST" ||
        endpoint.httpMessageType == "PUT"
      )
        xhttp.open(endpoint.httpMessageType, endpoint.url, true);
      else xhttp.open(endpoint.httpMessageType, endpoint.url);

      if (endpoint.headers.Authorization) {
        xhttp.setRequestHeader(
          "Content-Type",
          endpoint.headers["Content-Type"]
        );
        xhttp.setRequestHeader(
          "Authorization",
          endpoint.headers.Authorization.replace(
            "{TOKEN}",
            "access_token"
            // api.credentials.access_token
          )
        );
      }
      if (endpoint.headers["Content-Type"] == "application/json")
        xhttp.send(JSON.stringify(data));
      else xhttp.send();
    }

    xhttp.onreadystatechange = function () {
      if (xhttp.readyState == 4) {
        let response = null;
        try {
          let _data = "";
          if (
            xhttp.responseText != null &&
            xhttp.responseText.trim().length > 0
          )
            if (endpoint.headers.Accept == "application/json")
              _data = JSON.parse(xhttp.responseText);
            else _data = xhttp.responseText;

          response = {
            http: {
              status: xhttp.status,
            },
            data: _data,
          };
        } catch (err) {
          console.log(`${err.message} in ${xhttp.responseText}`);
        }

        callback(response);
      }
    };
  },
  baas: {
    request(tenantID, jwtoken, data, callback, type, endpoint) {
      const xhttp = new XMLHttpRequest();
      if (type == "login") {
        xhttp.open(
          "POST",
          `${PROTOCOL}://${baas_address}/v0/auth/oauth/token`,
          true
        );
        xhttp.setRequestHeader(
          "Content-Type",
          "application/x-www-form-urlencoded"
        );
        xhttp.setRequestHeader(
          "Authorization",
          "Basic ".concat(btoa("yc:c547d72d-607c-429c-81e2-0baec7dd068b"))
        );
        xhttp.send(data);
        endpoint = {
          headers: {},
        };
        endpoint.headers.Accept = "application/json";
      } else if (type == "data") {
        const URL = `${PROTOCOL}://${baas_address}/v0/persistence/s`;
        xhttp.open("POST", URL, true);
        xhttp.setRequestHeader("X-TenantID", tenantID);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Authorization", "Bearer ".concat(jwtoken));
        xhttp.send(JSON.stringify(data));
        endpoint = {
          headers: {
            Accept: "application/json",
          },
        };
      } else if (type == "accounts_and_roles") {
        xhttp.open(endpoint.httpMessageType, endpoint.url, true);
        xhttp.setRequestHeader("X-TenantID", tenantID);
        if (
          endpoint.httpMessageType == "POST" ||
          endpoint.httpMessageType == "PUT"
        ) {
          xhttp.setRequestHeader("Content-Type", "application/json");
          xhttp.send(JSON.stringify(data));
        } else if (
          endpoint.httpMessageType == "GET" ||
          endpoint.httpMessageType == "DELETE"
        ) {
          if (endpoint.headers["Content-Type"])
            xhttp.setRequestHeader("Accept", endpoint.headers["Content-Type"]);

          xhttp.send();
        }
      }

      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4) {
          let response = null;
          try {
            let _data = "";
            if (
              xhttp.responseText != null &&
              xhttp.responseText.trim().length > 0
            )
              if (endpoint.headers.Accept == "application/json")
                _data = JSON.parse(xhttp.responseText);
              else _data = xhttp.responseText;

            response = {
              http: {
                status: xhttp.status,
              },
              data: _data,
            };
          } catch (err) {
            console.log(`${err.message} in ${xhttp.responseText}`);
          }
          callback(response);
        }
      };
    },
    ds_data_backup_request(tenantID, jwtoken, data, callback) {
      const xhttp = new XMLHttpRequest();
      xhttp.open(
        api.endpoint.backend.ds.data_backup.httpMessageType,
        api.endpoint.backend.ds.data_backup.url,
        true
      );
      xhttp.responseType = "arraybuffer";
      xhttp.setRequestHeader("X-TenantID", tenantID);
      xhttp.setRequestHeader(
        "Content-Type",
        api.endpoint.backend.ds.data_backup.headers["Content-Type"]
      );
      xhttp.setRequestHeader("Authorization", "Bearer ".concat(jwtoken));
      xhttp.onload = function () {
        if (this.status === 200) {
          let filename = "";
          const disposition = xhttp.getResponseHeader("Content-Disposition");
          if (disposition && disposition.includes("attachment")) {
            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
            const matches = filenameRegex.exec(disposition);
            if (matches != null && matches[1])
              filename = matches[1].replace(/['"]/g, "");
          }
          const type = xhttp.getResponseHeader("Content-Type");

          const blob = new Blob([this.response], { type });
          if (typeof window.navigator.msSaveBlob !== "undefined") {
            window.navigator.msSaveBlob(blob, filename);
            callback({
              status: 200,
            });
          } else {
            const URL = window.URL || window.webkitURL;
            const downloadUrl = URL.createObjectURL(blob);

            if (filename) {
              const a = document.createElement("a");
              if (typeof a.download === "undefined")
                window.location = downloadUrl;
              else {
                a.href = downloadUrl;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
              }
            } else window.location = downloadUrl;

            setTimeout(function () {
              URL.revokeObjectURL(downloadUrl);
            }, 500);
            callback({
              status: 200,
            });
          }
        } else
          callback({
            status: xhttp.status,
            data: xhttp.responseText,
          });
      };
      xhttp.send(JSON.stringify(data));
    },
    ds_data_restore_request(tenantID, jwtoken, data, callback) {
      const xhttp = new XMLHttpRequest();
      xhttp.open(
        api.endpoint.backend.ds.data_restore.httpMessageType,
        api.endpoint.backend.ds.data_restore.url,
        true
      );
      xhttp.setRequestHeader("X-TenantID", tenantID);
      xhttp.setRequestHeader("Authorization", "Bearer ".concat(jwtoken));
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4)
          callback({
            http: {
              status: xhttp.status,
            },
            data: xhttp.responseText,
          });
        else console.log(xhttp.readyState);
      };
      xhttp.send(data);
    },
    ds_entity_populate_request(
      projectOwner,
      projectName,
      entityName,
      jwtoken,
      data,
      callback
    ) {
      const xhttp = new XMLHttpRequest();
      xhttp.open(
        api.endpoint.backend.ds.schema_populate.httpMessageType,
        api.endpoint.backend.ds.schema_populate.url
          .replace("{projectOwner}", projectOwner)
          .replace("{projectName}", projectName)
          .replace("{entityName}", entityName),
        true
      );
      // xhttp.setRequestHeader('Content-Type', 'multipart/form-data');
      xhttp.setRequestHeader("UserIDToken", "Bearer ".concat(jwtoken));
      xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4)
          callback({
            http: {
              status: xhttp.status,
            },
            data: xhttp.responseText,
          });
      };
      xhttp.send(data);
    },
  },
};

/*
Plugin Name: Simple Menu
Developer: Prashen Jeet Roy
Version: 1
functionality: onclick dropdown, body click hide, 
*/
// (function($) {
//     $.fn.simpleMenu = function(options) {
//         "use strict";
//         var $a = $(this), $b = $(this).find('a').next();
//         $a.on('click', 'a', function(e) {
//             e.stopPropagation();
//             var $c = $(this).next().hasClass('sub-menu');
//             if ($c === true) {
//                 e.preventDefault();
//             }

//             $(this).next().slideToggle(300)
//                 .parent().siblings().children('ul')
//                 .not($(this).next()).hide()
//         });
//         $(document).on('click', $b, function(e) {
//             $b.hide(200);
//         });
//     }
// }(jQuery));

// $('.simple-menu').simpleMenu();

// $('.simple-menu .sub-menu a').click(function(e) {
//     $('.sub-menu').hide(200);
// });

// String.prototype.replaceAll = function(search, replacement) {
//     return this.split(search).join(replacement);
// };

// String.prototype.isAlphaNumeric = function() {
//     var regExp = /^[A-Za-z0-9]+$/;
//     return (this.match(regExp));
// };

// if (!Array.prototype.clear) {
//     Array.prototype.clear = function() {
//         this.splice(0, this.length);
//     };
// }

// /* *************** *
//  * Confirme Dialog *
//  * *************** */

// const ui = {
//     confirm: async (message) => createConfirmDialog(message)
// }

// const createConfirmDialog = (message) => {
//     return new Promise((complete, failed) => {
//         $('#confirmMessage').text(message)

//         $('#confirmYes').off('click');
//         $('#confirmNo').off('click');

//         $('#confirmYes').on('click', () => { $('.confirm').hide(); complete(true); });
//         $('#confirmNo').on('click', () => { $('.confirm').hide(); complete(false); });

//         $('.confirm').show();
//     });
// }

// const launchConfirmDialog = async (message) => {
//     const confirm = await ui.confirm(message);

//     if (confirm) {
//         alert('yes clicked');
//     } else {
//         alert('no clicked');
//     }
// }

// function copyToClipboard(value) {
//     $('#to_clipboard').val(value).select();
//     document.execCommand("copy");
// }
