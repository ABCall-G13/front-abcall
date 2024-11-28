import React, { useState, useEffect } from 'react';
import './Chatbot.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import axiosInstance from '../../utils/axiosInstance';
import chatIcon from '../../assets/icons/chat.svg';
import sendIcon from '../../assets/icons/row.svg';
import botIcon from '../../assets/icons/bot-icon.svg';

interface Message {
  sender: 'user' | 'bot';
  text: string | JSX.Element;
  timestamp: string;
}

interface Cliente {
  id: number;
  nombre: string;
  nit: string;
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: (
        <span>
          ¡Hola! Soy tu asistente virtual.
          <br />
          Por favor, ingresa tu tipo de documento.
          <br />
          Las opciones son:
          <br />
          <b>- CC:</b> Cédula de ciudadanía
          <br />
          <b>- PP:</b> Pasaporte
          <br />
          <b>- CE:</b> Cédula de extranjería
          <br />
          <b>- NIT:</b> Número de Identificación Tributaria
        </span>
      ),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isAskingProblem, setIsAskingProblem] = useState(false);
  const [isRetryOrExit, setIsRetryOrExit] = useState(false);
  const [isSolvedOrNot, setIsSolvedOrNot] = useState(false);
  const [isRegisteringIncident, setIsRegisteringIncident] = useState(false);

  useEffect(() => {
    if (open) {
      axiosInstance
        .get('/clientes')
        .then((response) => setClientes(response.data))
        .catch((error) => console.error('Error al obtener los clientes:', error));
    }
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetBot();
  };

  const resetBot = () => {
    setMessages([
      {
        sender: 'bot',
        text: (
          <span>
            ¡Hola! Soy tu asistente virtual.
            <br />
            Por favor, ingresa tu tipo de documento.
            <br />
            Las opciones son:
            <br />
            <b>- CC:</b> Cédula de ciudadanía
            <br />
            <b>- PP:</b> Pasaporte
            <br />
            <b>- CE:</b> Cédula de extranjería
            <br />
            <b>- NIT:</b> Número de Identificación Tributaria
          </span>
        ),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setUserInput('');
    setDocType('');
    setDocNumber('');
    setSelectedClient(null);
    setUserName(null); // Reinicia el nombre del usuario
    setIsAskingProblem(false);
    setIsRetryOrExit(false);
  };

  const validateUser = async (client: Cliente): Promise<boolean> => {
    try {
      const response = await axiosInstance.get('/usuario', {
        params: { doc_type: docType, doc_number: docNumber, client: client.nit },
      });
      console.log(response.data.nombre);
      if (response.data && response.data.nombre) {
        setUserName(response.data.nombre);
        console.log(userName);
        return true;
      }
  
      // Si no hay un nombre válido, manejar el caso
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `El usuario con documento ${docType}-${docNumber} no está validado para este cliente (${client.nombre}).`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsRetryOrExit(true);
      return false;
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Hubo un error al validar el usuario. Por favor, intenta más tarde.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return false;
    }
  };
  

  const validateClientPlan = async (client: Cliente): Promise<boolean> => {
    try {
      const response = await axiosInstance.get(`/clientes/${client.nit}`);
      const { plan } = response.data;

      if (plan === 'empresario' || plan === 'empresario_plus') {
        return true;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Lo siento, el cliente ${client.nombre} no tiene un plan compatible con este servicio.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsRetryOrExit(true);
      return false;
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Hubo un error al validar el plan del cliente. Por favor, intenta más tarde.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessages: Message[] = [
      ...messages,
      {
        sender: 'user',
        text: userInput,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
    setMessages(newMessages);
    const userResponse = userInput.trim().toLowerCase();
    setUserInput('');

    if (isRetryOrExit) {
      if (userResponse === '1') {
        resetBot();
        return;
      } else if (userResponse === '2') {
        setOpen(false);
        return;
      } else {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Opción no válida. Por favor, escribe "1" para volver a intentar o "2" para salir.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
    }
  
    if (isSolvedOrNot) {
      if (userResponse === '1') {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: '¡Qué gusto haber podido ayudarte! Si necesitas más asistencia, no dudes en contactar nuevamente.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsRetryOrExit(true);
        setIsSolvedOrNot(false);
        return;
      } else if (userResponse === '2') {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Por favor, proporciona más detalles sobre tu problema para registrar el incidente.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsRegisteringIncident(true);
        setIsSolvedOrNot(false);
        return;
      }
    }
    if (isRegisteringIncident) {
      try {
        const searchResponse = await axiosInstance.post('/search-issues', { query: userResponse });
        const solutions = searchResponse.data || [];
        const categoria = solutions[0]?.categoria || 'general';
        const prioridad = solutions[0]?.prioridad || 'media';

        const incidentPayload = {
          description: userResponse,
          categoria,
          prioridad,
          canal: 'aplicación',
          cliente_id: selectedClient?.id,
          estado: 'abierto',
          fecha_creacion: new Date().toISOString().split('T')[0],
        };

        await axiosInstance.post('/incidente', incidentPayload);

        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'El incidente ha sido registrado exitosamente. Nuestro equipo de soporte se pondrá en contacto contigo pronto.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            sender: 'bot',
            text: (<span>¿Hay algo más en lo que pueda ayudarte? <br/>
              Escribe<br/>
              <b>1</b> para volver a iniciar<br/>
              <b>2</b> para salir</span>),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsRegisteringIncident(false);
        setIsRetryOrExit(true);
      } catch (error) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Hubo un error al registrar el incidente. Por favor, intenta nuevamente más tarde.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
      return;
    }


    if (!docType) {
      const validDocTypes = ['cc', 'pp', 'ce', 'nit'];
      if (!validDocTypes.includes(userResponse)) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: (
              <span>
                Tipo de documento no válido. Por favor, ingresa uno de los siguientes:
                <br />
                <b>- CC:</b> Cédula de ciudadanía
                <br />
                <b>- PP:</b> Pasaporte
                <br />
                <b>- CE:</b> Cédula de extranjería
                <br />
                <b>- NIT:</b> Número de Identificación Tributaria
              </span>
            ),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
      setDocType(userResponse.toUpperCase());
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: 'Por favor, ingresa tu número de identificación.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    if (!docNumber) {
      if (isNaN(Number(userResponse))) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'El número de identificación debe ser un valor numérico. Inténtalo de nuevo.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
      setDocNumber(userResponse);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: (
            <span>
              Selecciona el cliente asociado escribiendo el número correspondiente de la lista:
              <br />
              {clientes.map((cliente, index) => (
                <span key={cliente.id}>
                  <b>{index + 1}:</b> {cliente.nombre}
                  <br />
                </span>
              ))}
            </span>
          ),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      return;
    }

    if (!selectedClient) {
      const clientIndex = parseInt(userResponse) - 1;
      if (isNaN(clientIndex) || clientIndex < 0 || clientIndex >= clientes.length) {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Número de cliente no válido. Por favor, selecciona un número de la lista.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        return;
      }
      const clienteSeleccionado = clientes[clientIndex];
      const isUserValid = await validateUser(clienteSeleccionado);
      if (!isUserValid) return;

      const isPlanValid = await validateClientPlan(clienteSeleccionado);
      if (!isPlanValid) return;

      setSelectedClient(clienteSeleccionado);
      setMessages([
        ...newMessages,
        {
          sender: 'bot',
          text: `¡Hola! Por favor, describe tu problema con ${clienteSeleccionado.nombre}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsAskingProblem(true);
      return;
    }

    if (isAskingProblem) {
      try {
        const response = await axiosInstance.post('/search-issues', { query: userResponse });
        const solutions = response.data || [];
        if (solutions.length > 0) {
          // Extraer las soluciones en formato legible para enviarlas al endpoint de ChatGPT
          const solutionsText = solutions
            .map((sol: any, index: number) => `${index + 1}. ${sol.solucion}`)
            .join('\n');
          const chatGptResponse = await axiosInstance.post('/generate-response', {
            query: `Explica estas soluciones de forma clara y útil para el cliente:\n${solutionsText}`,
          });
      
          const improvedSolutions = chatGptResponse.data.response;
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: (
                <span>
                  Estas son algunas posibles soluciones detalladas:
                  <br />
                  {improvedSolutions.split('\n').map((line: string, index: number) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </span>
              ),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
            {
              sender: 'bot',
              text: (
                <span>
                  ¿Te ayudó alguna de estas soluciones?
                  <br />
                  Escribe
                  <br />
                  <b>1</b> para Sí
                  <br />
                  <b>2</b> para No.
                </span>
              ),
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
      
          setIsSolvedOrNot(true);
        } else {
          setMessages([
            ...newMessages,
            {
              sender: 'bot',
              text: 'No se encontraron soluciones. Describe tu problema para registrar un incidente.',
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
          ]);
          setIsRegisteringIncident(true);
        }
      } catch {
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: 'Hubo un error al buscar soluciones. Inténtalo más tarde.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
      return;
    }
  };

  return (
    <>
      <button onClick={handleOpen} className="chatbot-toggle">
        <img src={chatIcon} alt="Chat Icon" /> Chat en línea
      </button>

      <Dialog open={open} PaperProps={{ className: 'chatbot-dialog' }} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Asistente Virtual</DialogTitle>
        <DialogContent dividers className="chatbot-messages">
          {messages.map((message, index) => (
            <div key={index} className="message-container">
              {message.sender === 'bot' && (
                <div className="bot-header">
                  <img src={botIcon} alt="Bot Icon" className="bot-icon" />
                  <span className="bot-name">Asistente</span>
                </div>
              )}
              <div className={`message ${message.sender}`}>
                {message.text}
              </div>
              <span className={`timestamp ${message.sender}`}>{message.timestamp}</span>
            </div>
          ))}
        </DialogContent>

        <DialogActions style={{ padding: '10px' }}>
          <TextField
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Escribe un mensaje..."
            fullWidth
            variant="standard"
            InputProps={{ disableUnderline: true }}
            className="chatbot-input"
          />
          <button onClick={handleSendMessage} className="button-chat">
            <img src={sendIcon} alt="Send Icon" />
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Chatbot;
