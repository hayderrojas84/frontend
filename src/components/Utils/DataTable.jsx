import { useEffect, useState } from "react";
import '../../styles/DataTable.css';
import { showDataTableOptions } from "../../shared/constants/selectOptions";
import FormField from "../Forms/FormField";
import SelectComponent from "../Forms/Select";

function DataTable({ data = { content: [], headers: [], total: 1 }, form_actions = null, model = null, pagination = null, setPagination = null, userLogged = null, customFilters = [], register_button = false, toggleModal = null }) {
  const [dataToRender, setDataToRender] = useState(null);
  const [tablePagination, setTablePagination] = useState({
    pages: 1,
    countShowItems: 1,
    firstItem: 1
  })

  useEffect(() => {
    setDataToRender(data.content ? data.content.map((item) => {
      const itemToRender = data.headers.map((header) => {
        if (header.access !== 'form_actions' && !header.access.includes('image')) {
          if (header.access.includes('.')) {
            const [parent, child] = header.access.split('.');
            if (child.toLowerCase() === 'description') {
              return <td className="truncated_description" key={`${item.id}_${header.access}}`}>{item[`${parent}`][`${child}`]}</td>
            }

            return <td key={`${item.id}_${header.access}}`}>{item[`${parent}`][`${child}`]}</td>
          }
          if (typeof item[`${header.access}`] === 'object' && Array.isArray(item[`${header.access}`])) {
            const names = item[`${header.access}`].map((row) => row.name).join(', ') || `No tiene ${header.name}`;
            return (
              <td key={`${item.id}_${header.access}}`}>{names}</td>
            )
          }

          if (header.access.toLowerCase() === 'id') {
            return (
              <td key={`${item.id}_${header.access}}`} className="font_bold">{item[`${header.access}`]}</td>
            )
          }

          if (header.access.toLowerCase() === 'description') {
            return (
              <td title={item[`${header.access}`]} className="truncated_description" key={`${item.id}_${header.access}}`}>{item[`${header.access}`]}</td>
            )
          }

          return (
            <td key={`${item.id}_${header.access}}`}>{item[`${header.access}`]}</td>
          )
        }
        if (header.access.includes('image')) {
          if (header.access.includes('.')) {
            const [parent, child] = header.access.split('.');
            return <td key={`${item.id}_${header.access}}`}>
              {item[`${parent}`][`${child}`] ? (<img className="datatable_img" src={item[`${parent}`][`${child}`]} alt={item[`${parent}`].name} />) : ('No tiene imagen')}
            </td>
          }
          return <td key={`${item.id}_${header.access}}`}>
            {item[`${header.access}`] ? (<img className="datatable_img" src={item[`${header.access}`]} alt={item.name} />) : ('No tiene imagen')}
          </td>
        } else if (form_actions && form_actions.length) {
          return <td key={`${item.id}_actions`}>{form_actions.map((action) => {
            let { onClick, ...attributes } = action.attributes ? action.attributes : { onClick: null }
            if (onClick) {
              if (action.name.toLowerCase() === 'eliminar' || action.name.toLowerCase() === 'ver' || action.name.toLowerCase() === 'mantenimiento') {
                onClick = () => action.attributes.onClick({ id: item.id });
              }
              if (action.name.toLowerCase() === 'editar') {
                onClick = () => action.attributes.onClick({ item: item });
              }
              if (action.name.toLowerCase() === 'membresía') {
                onClick = () => action.attributes.onClick({ identification: item.people?.identification });
              }
            }
            if (userLogged) {
              if (action.name.toLowerCase() !== 'membresía') attributes = {
                ...attributes,
                disabled: userLogged && userLogged.id === item.id,
              }
            }
            return (<button key={`${item.id}_${action.name}`} {...attributes} onClick={onClick}>{action.name}</button>)
          })}</td>
        } else {
          return <td>...</td>
        }

      });
      return (<tr key={item.id}>{itemToRender}</tr>)
    }) : null);


    if (pagination) {
      let first = pagination.page === 1 ? 1 : (pagination.perPage * (pagination.page - 1));
      let count = data.content.length <= pagination.perPage ? data.content.length : pagination.perPage;
      if (pagination.page === 1 && data.total === 0) {
        first = 0;
      }
      if (pagination.page > 1) {
        count = first + data.content.length;
      }

      setTablePagination({
        pages: Array.from({ length: (Math.ceil(data.total / pagination.perPage)) }, (_, index) => index + 1),
        countShowItems: count,
        firstItem: first
      });
    }

  }, [data, form_actions, pagination, userLogged]);

  const handleChangePage = ({ page }) => {
    if (setPagination) setPagination((oldPagination) => {
      return {
        ...oldPagination,
        page
      }
    });
  }

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setPagination((oldPagination) => {
      return ({
        ...oldPagination,
        search: value
      })
    })
  }

  const handleSelectChange = (e) => {
    const { name } = e.target;
    const { value } = e.target.selectedOptions[0];

    if (name === 'perPage') {
      setPagination((oldPagination) => {
        return ({
          ...oldPagination,
          [name]: value || 10
        })
      })
    } else {
      setPagination((oldPagination) => {
        return ({
          ...oldPagination,
          [name]: value || null
        })
      })
    }
  }

  const toggleOrder = ({ sort }) => {
    if (!pagination || !setPagination) return;
    if (sort.toLowerCase().includes('image') || sort.toLowerCase() === 'machines' || sort.toLowerCase() === 'exercises' || sort.toLowerCase().includes('paymentstatus') || sort.toLowerCase() === 'form_actions') return;
    let order = pagination.order ?? 'asc';

    let oldSort = pagination.sort;

    if (oldSort) {
      order = order === 'asc' ? 'desc' : 'asc';
    }

    setPagination((oldPagination) => {
      return {
        ...oldPagination,
        order,
        sort
      }
    })

  }


  return (
    <div className="dataTable_container">
      <div className="general_table_options">
        {(register_button && toggleModal) && (
          <div className="register_button"><button className="primary" onClick={toggleModal}>Nuevo</button></div>
        )}
        {pagination && (
          <div className="table_options">
            {customFilters.length ? (
              <div className="custom_filters">
                {customFilters.map((filter) => {
                  if (filter.type?.toLowerCase() === 'select') {
                    return (
                      <FormField key={`${filter.type}_${filter.model}`} label={filter.name}>
                        <SelectComponent
                          model={filter.model}
                          onChange={handleSelectChange}
                          options={filter.options}
                        />
                      </FormField>
                    )
                  }
                  return ''
                })}
              </div>
            ) : ('')}

            <div className="pagination_options">
              <FormField label={'Buscar'}>
                <input
                  type="text"
                  name="search"
                  placeholder="Buscar"
                  onChange={handleSearchChange}
                  required
                />
              </FormField>
              <FormField label={'Ver'}>
                <SelectComponent
                  model="perPage"
                  onChange={handleSelectChange}
                  defaultValue="10"
                  options={showDataTableOptions}
                />
              </FormField>
            </div>
          </div>
        )}
      </div>
      <div className="dataTable">
        <table>
          <thead>
            {(model && data.headers) && (
              <tr>
                <th colSpan={data.headers?.length}>{model}</th>
              </tr>
            )}
            {data.content.length && data.headers?.length ? (
              <tr>
                {data.headers.map((header) => {
                  return (
                    <th className={`${pagination && setPagination && !header.access.includes('image') && header.access !== 'form_actions' && !header.access.toLowerCase().includes('paymentstatus') && header.access.toLowerCase() !== 'machines' && header.access.toLowerCase() !== 'exercises' ? 'sort_th' : ''}`} onClick={() => toggleOrder({ sort: header.access })} key={header.access}>{header.name}</th>
                  )
                })}
              </tr>
            ) : ''}
          </thead>
          <tbody>
            {dataToRender}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="pages_information">
          <p>Mostrando {tablePagination.firstItem} a {tablePagination.countShowItems} de {data.total} {model?.toLowerCase()}</p>
          {tablePagination.pages.length ? (
            <div className="pages_buttons">
              {
                tablePagination.pages.map((item) => {
                  if (item === 1 || item === tablePagination.pages || item <= pagination.page + 2 || item >= pagination.page - 2) {
                    return <button key={`${item}_page`} disabled={item === pagination.page} className="page_button" onClick={() => { handleChangePage({ page: item }) }}>{item}</button>
                  } else {
                    return <button key={`${item}_page`} disabled={true}>...</button>
                  }
                })
              }
            </div>
          ) : ('')}
        </div>
      )}
    </div>
  );
}

export default DataTable;