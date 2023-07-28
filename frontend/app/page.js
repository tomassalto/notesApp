"use client";
import Link from "next/link";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useEffect, useState } from "react";

const initialState = { name: "", price: "" };
const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [product, setProduct] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null); // Nuevo estado para almacenar el ID del producto seleccionado para editar
  const [showArchived, setShowArchived] = useState(false); // Nuevo estado para controlar si se muestran las notas archivadas o no archivadas

  const handleToggleArchived = () => {
    setShowArchived(!showArchived);
    fetchProducts(!showArchived); // Llamar a fetchProducts para actualizar los productos según el nuevo estado
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    const inputName = e.target.name;

    setProduct({
      ...product,
      [inputName]: inputValue,
    });
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${baseUrl}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      setProduct(initialState);

      console.log({ data });
      const newProducts = [data.product, ...products];
      setProducts(newProducts);
      fetchProducts();
      console.log("Producto creado con exito!");
    } catch (error) {
      console.log({ error });
    }
  };

  // const fetchProducts = () => {
  //   fetch(`${baseUrl}/products`)
  //     .then((res) => res.json())
  //     .then(({ products }) => {
  //       setProducts(products);
  //       console.log(products);
  //     });
  // };

  const fetchProducts = (archived) => {
    const url = archived
      ? `${baseUrl}/products/archived`
      : `${baseUrl}/products`;

    fetch(url)
      .then((res) => res.json())
      .then(({ products }) => {
        setProducts(products);
        console.log(products);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleEdit = (product) => {
    setSelectedProductId(product._id);
    setProduct({ ...product });
  };

  const handleUpdateProduct = async () => {
    try {
      const res = await fetch(`${baseUrl}/products/${selectedProductId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      console.log("Producto actualizado:", data);
      fetchProducts(); // Actualiza la lista de productos después de la actualización
      setSelectedProductId(null); // Limpia el ID del producto seleccionado para editar
      setProduct(initialState);
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  return (
    <>
      <header>
        <h3 className="">NoteApp</h3>
        <button className="cblue" onClick={handleToggleArchived}>
          Mostrar notas {showArchived ? "no archivadas" : "archivadas"}
        </button>
      </header>
      <div className="container">
        <form className="">
          <div className="note-container">
            <input
              className="border"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              placeholder="Titulo"
            ></input>
            <input
              className="border"
              type="text"
              name="price"
              value={product.price}
              onChange={handleChange}
              placeholder="Content"
            ></input>
          </div>
          <button onClick={handleClick}>Crear Nota</button>
        </form>
      </div>
      <div className="note-container">
        {products.map(({ _id, name, price }) => (
          <div className="note" key={_id}>
            <p className="title">{name}</p>
            <p className="content">{price}</p>
            <div className="df jcsb">
              <div className="">
                <button
                  className="w100 cred"
                  onClick={() => {
                    fetch(`${baseUrl}/products/${_id}`, {
                      method: "DELETE",
                    }).then((res) => {
                      res.json();
                      fetchProducts();
                    });
                  }}
                >
                  Delete
                </button>
              </div>
              <div className="df">
                <button
                  style={{ backgroundColorcolor: "red", solid: "important" }}
                  className="w100"
                  onClick={() => {
                    fetch(`${baseUrl}/products/archive/${_id}`, {
                      method: "DELETE",
                    }).then((res) => {
                      res.json();
                      fetchProducts();
                    });
                  }}
                >
                  Archive
                </button>
              </div>
              <div className="df fr">
                {/* Agregar el botón de editar que muestra el popup */}
                <button
                  style={{ backgroundColorcolor: "red", solid: "important" }}
                  className="w100"
                  onClick={() => handleEdit({ _id, name, price })}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Implementar el popup para editar */}
      <Popup
        open={selectedProductId !== null}
        onClose={() => setSelectedProductId(null)}
      >
        <div className="w100">
          <h2 className="titulo2 w100 tac">Editar Producto</h2>
        </div>
        <div className="modal note-container">
          <form>
            <p className="lt">Titulo:</p>
            <input
              className="border"
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
            <p className="lc">Content:</p>
            <input
              className="border"
              type="text"
              name="price"
              value={product.price}
              onChange={handleChange}
            />
            <button
              className="bgreen"
              type="button"
              onClick={handleUpdateProduct}
            >
              Guardar Cambios
            </button>
          </form>
        </div>
      </Popup>
    </>
  );
}
