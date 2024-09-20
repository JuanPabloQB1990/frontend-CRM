import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { classNames } from 'primereact/utils';
import { Dialog } from "primereact/dialog";
import { FilterMatchMode } from "primereact/api";
import { Tag } from "primereact/tag";
import Layout from "../layout/layout";
import { Dropdown } from "primereact/dropdown";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import useOrder from "../hooks/useOrder";
import { InputText } from "primereact/inputtext";

export default function AdminClients() {
  let emptyClient = {
    name: "",
    email: "",
    rol: "client"
  };

  const [client, setClient] = useState(emptyClient);
  const [clientDialog, setClientDialog] = useState(false);
  const [deleteClientDialog, setDeleteClientDialog] = useState(false);
  const [deleteClientsDialog, setDeleteClientsDialog] = useState(false);
  const [selectedClients, setSelectedClients] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  
  const navigate = useNavigate()
  
  const toast = useRef(null);
  const dt = useRef(null);
  
  const [filters, setFilters] = useState({
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    email: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
  });
  const [statuses] = useState(["client", "admin"]);
  
  const { handleClientOrder } = useOrder()

  const {
    auth,
    clients,
    loading,
    updateUserByAdmin,
    deleteClientById,
    deleteClients,
    getUsersAll,
    message,
    setMessage,
    postClient
  } = useUser();

  useEffect(() => {
    
    getUsersAll();
  }, [getUsersAll, clientDialog, deleteClientDialog, deleteClientsDialog]);
  
  useEffect(() => {
    
    if (message.type) {
      toast.current.show({
        severity: message.type,
        summary: message.title,
        detail: message.msg,
        life: 3000,
      });
      
      setMessage({})

    }
  }, [message]);

  const openNew = () => {
    setClient(emptyClient);
    setSubmitted(true);
    setClientDialog(true);
  };
  
  const hideDialog = () => {
    setSubmitted(false);
    setClientDialog(false);
  };

  const hideDeleteClientDialog = () => {
    setDeleteClientDialog(false);
  };

  const hideDeleteClientsDialog = () => {
    setDeleteClientsDialog(false);
  };

  const saveClient = async() => {
    setSubmitted(true);
    
    if (client.name.trim()) {

        if (client.id) {
            await updateUserByAdmin(client, auth.token)
            //toast.current.show({ severity: 'success', summary: 'Cliente editado', detail: "satisfactoriamente", life: 3000 });
        } else {
            await postClient(auth.token, client)
            //toast.current.show({ severity: 'success', summary: 'Cliente guardado', detail: "satisfactoriamente", life: 3000 });
        }
        
        setSubmitted(false);
        setClientDialog(false);
        setClient(emptyClient);
    }
};

  
  const addOrderProducts = async(rowClient) => {
    
    await handleClientOrder(auth, rowClient);
    navigate(`/admin-products`)
  }
  

  const editClient = (client) => {
    setClient({ ...client });
    setClientDialog(true);
  };

  const confirmDeleteClient = (client) => {
    setClient(client);
    setDeleteClientDialog(true);
  };

  const deleteClient = () => {

    deleteClientById(client.id);

    setDeleteClientDialog(false);
    setClient(emptyClient);

  };

  const confirmDeleteSelected = () => {
    setDeleteClientsDialog(true);
  };

  const deleteSelectedClients = () => {
    
    const ids = [];

    selectedClients.forEach((cli) => {
      ids.push(cli.id);
    });

    const ObjecIds = {
      ids,
    };

    deleteClients(ObjecIds);
    setDeleteClientsDialog(false);
    setSelectedClients(null);

  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _client = { ...client };
    _client[`${name}`] = val;
    setClient(_client);
};

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="New"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
        <Button
          label="Delete"
          icon="pi pi-trash"
          severity="danger"
          onClick={confirmDeleteSelected}
          disabled={!selectedClients || !selectedClients.length}
        />
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          onClick={() => editClient(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteClient(rowData)}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          style={{ color: 'green', marginLeft: '7px' } }
          outlined
          severity="pi pi-plus"
          onClick={() => addOrderProducts(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0">Administra tus Clientes</h4>
    </div>
  );

  const clientDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
      <Button label="Save" loading={loading} icon="pi pi-check" onClick={saveClient} />
    </React.Fragment>
  );

  const deleteClientDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteClientDialog}
      />
      <Button
        loading={loading}
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteClient}
      />
    </React.Fragment>
  );
  const deleteClientsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteClientsDialog}
      />
      <Button
        loading={loading}
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedClients}
      />
    </React.Fragment>
  );

 
  return (
    <Layout>
      <Toast ref={toast} />
      <div className="card">
        <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

        <DataTable
          ref={dt}
          value={clients}
          selection={selectedClients}
          onSelectionChange={(e) => setSelectedClients(e.value)}
          dataKey="id"
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} clients"
          filters={filters}
          filterDisplay="row"
          loading={loading}
          globalFilterFields={["name", "email", "country", "city", "rol"]}
          header={header}
        >
          <Column selectionMode="multiple" exportable={false}></Column>
          <Column
            field="name"
            header="Nombre"
            filter
            filterPlaceholder="Buscar por nombre"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="email"
            header="Correo"
            filter
            filterPlaceholder="Buscar por correo"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            exportable={false}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={clientDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Detalles del Cliente"
        modal
        className="p-fluid"
        footer={clientDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Nombre
          </label>
          <InputText id="name" value={client.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.name })} />
                    {submitted && !client.name && <small className="p-error">Nombre es requerido.</small>}
        </div>
        <div className="field">
          <label htmlFor="email" className="font-bold">
            Correo
          </label>
          <InputText id="email" type="email" value={client.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.email })} />
                    {submitted && !client.email && <small className="p-error">Email es requerido.</small>}
        </div>
      </Dialog>

      <Dialog
        visible={deleteClientDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteClientDialogFooter}
        onHide={hideDeleteClientDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {client && (
            <span>
              Estas seguro de eliminar a <b>{client.name} ?</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={deleteClientsDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirm"
        modal
        footer={deleteClientsDialogFooter}
        onHide={hideDeleteClientsDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {client && (
            <span>estas seguro de eliminar estos Clientes ?</span>
          )}
        </div>
      </Dialog>
    </Layout>
  );
}
