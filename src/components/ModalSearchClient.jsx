import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useContext, useMemo, useState } from "react";
import { UserContext } from "../context/UserProvider";
import { OrderContext } from "../context/OrderProvider";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ModalSearchClient = () => {

    const [client, setClient] = useState("");
    
    const [search, setSearch] = useState("");

    const { clients } = useContext(UserContext)
    const { handleModal, visible, handleClientOrder } = useContext(OrderContext);
    
    const submitClient = () => {
        setSearch(client)
        
    }
    
    const clientsFiltered = useMemo(() => 
        clients.filter(cli => { 
            return cli.name.toLowerCase().includes(search.toLowerCase());
    }), [search])

    const sendClientOrder = (client) => {
        handleClientOrder(client)
        handleModal(false)
    }
    

    const actionTemplate = (row) => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button onClick={() => sendClientOrder(row)} type="button" icon="pi pi-plus-circle" severity="success" rounded></Button>
            </div>
        );
    };


      
  return (
    <Dialog header="Busca un Cliente para el pedido" visible={visible} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }} onHide={() => {if (!visible) return; handleModal(false); }}>
      <div className="flex flex-row gap-4">
        <div className="flex flex-column gap-2 mb-2 flex-grow-1">
            <InputText
            id="username"
            aria-describedby="username-help"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            />
            <small id="username-help">
            Ingresa el nombre del Cliente y seleccionalo.
            </small>
        </div>
        <div className="align-content-start">
            <Button label="Submit" onClick={submitClient} />
        </div>

      </div>
      <div>
        <DataTable value={clientsFiltered} tableStyle={{ minWidth: '50rem' }} editMode="row">
            <Column field="name" header="Nombre"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="country" header="Pais"></Column>
            <Column field="city" header="Ciudad"></Column>
            <Column body={actionTemplate} headerClassName="w-10rem" />
        </DataTable>
      </div>
    </Dialog>
  );
};

export default ModalSearchClient;
