import { Redirect } from "expo-router";

export default function NotFound() {
  return (
    <Redirect
      href={{
        pathname: "/pages/ErrorPage",
        params: {
          codigo: "404",
          mensaje: "La página que buscas no existe.",
          reference: "NOT_FOUND",
        },
      }}
    />
  );
}