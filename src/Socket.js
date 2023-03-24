import io from "socket.io-client";

/*export const socket = io.connect("https://wordliar.adaptable.app", {
  transports: ["polling"]
});*/

export const socket = io.connect("http://localhost:3001", {
  transports: ["polling"]
});