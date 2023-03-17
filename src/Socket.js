import io from "socket.io-client";

export const socket = io.connect("https://wordliar.adaptable.app", {
  transports: ["polling"]
});