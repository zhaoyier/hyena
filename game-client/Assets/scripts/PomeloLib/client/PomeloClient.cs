using System.Collections;
using SimpleJson;

using System;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Threading;
using System.Collections.Generic;

namespace Pomelo.DotNetClient
{
    public class PomeloClient : IDisposable
    {
        /// <summary>
        /// Э�� start ������������ö��
        /// </summary>
        enum StartParamType
        {
            NONE, JSON, HAND_SHAKE_CALLBACK, ALL
        }

        private delegate string AsyncInitClient(); // �첽��ʼ���ͻ���ί��
        public delegate void ActionException(string error); // �����쳣ί��

        // ���� ====================================
        public const string EVENT_DISCONNECT = "disconnect";

        // ���� ====================================
        private bool disposed = false; // ʵ�� IDisposable �ӿڵ��ж�

        private EventManager eventManager; // ί�й�����

        private AsyncInitClient _asyncDel; // �첽��ʼ���ͻ���ί��
        private Socket socket; // socket ����
        private Protocol protocol; // Э�����

        private uint reqId = 1; // request ���� id

        private string _host = ""; // ����
        private int _port = 0; // �˿�
        private bool _isConnected = false; // ����״̬

        private JsonObject _user; // json ����
        private Action<JsonObject> _handshakeCallback; // ���ֻص�

        public event System.Action OnConnect; // ��������
        public event System.Action OnDisconnect; // �Ͽ�����
        public event ActionException OnException; // �����쳣

        // ���� ====================================
        /// <summary>
        /// ����|IP
        /// </summary>
        public string host { get { return this._host; } }
        /// <summary>
        /// �˿�
        /// </summary>
        public int port { get { return _port; } }
        /// <summary>
        /// ����״̬
        /// </summary>
        public bool isConnected { get { return this._isConnected; } }

        /// <summary>
        /// ����
        /// </summary>
        /// <param name="host">����|IP</param>
        /// <param name="port">�˿�</param>
        public PomeloClient(string host, int port)
        {
            this._host = host;
            this._port = port;

            this.eventManager = new EventManager();
        }
        /// <summary>
        /// ��������
        /// </summary>
        ~PomeloClient()
        {
            this.Dispose(false);
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        // The bulk of the clean-up code 
        protected virtual void Dispose(bool disposing)
        {
            if (this.disposed) return;

            if (disposing)
            {
                // free managed resources
                this.protocol.close();
                if (this.socket.Connected)
                {
                    this.socket.Shutdown(SocketShutdown.Both);
                    this.socket.Close();
                }

                //Call disconnect callback
                this.eventManager.InvokeOnEvent(EVENT_DISCONNECT, null);
            }

            this.disposed = true;
        }

        private void InitClient(StartParamType type)
        {
            this._asyncDel = this.AsyncInit;
            IAsyncResult ret = this._asyncDel.BeginInvoke(this.AsyncCallback, type);
        }
        private string AsyncInit()
        {
            string error = "";

            this.socket = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            try
            {
                IPEndPoint ie = new IPEndPoint(IPAddress.Parse(this._host), this._port);
                this.socket.Connect(ie);
            }
            catch (Exception e)
            {
                error = e.Message;
            }

            this.protocol = new Protocol(this, socket);

            return error;
        }
        private void AsyncCallback(IAsyncResult result)
        {
            // socket ����ʧ��
            string error = this._asyncDel.EndInvoke(result).Trim();
            if (string.IsNullOrEmpty(error) == false)
            {
                this._isConnected = false;
                if (this.OnException != null)
                    this.OnException(error);

                return;
            }

            // ����Э�飬��ʼ����
            StartParamType type = (StartParamType)result.AsyncState;
            try
            {
                switch (type)
                {
                    case StartParamType.NONE:
                        protocol.start(null, null);
                        break;
                    case StartParamType.JSON:
                        protocol.start(this._user, null);
                        break;
                    case StartParamType.HAND_SHAKE_CALLBACK:
                        protocol.start(null, this._handshakeCallback);
                        break;
                    case StartParamType.ALL:
                        protocol.start(this._user, this._handshakeCallback);
                        break;
                }

                this._isConnected = true;
                if (this.OnConnect != null)
                    this.OnConnect();
            }
            catch (Exception e)
            {
                this._isConnected = false;
                if (this.OnException != null)
                    this.OnException(e.Message);
            }
        }

        // connect >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        public void connect()
        {
            this._user = null;
            this._handshakeCallback = null;

            this.InitClient(StartParamType.NONE);
        }

        public void connect(JsonObject user)
        {
            this._user = user;
            this._handshakeCallback = null;

            this.InitClient(StartParamType.JSON);
        }

        public void connect(Action<JsonObject> handshakeCallback)
        {
            this._user = null;
            this._handshakeCallback = handshakeCallback;

            this.InitClient(StartParamType.HAND_SHAKE_CALLBACK);
        }

        public void connect(JsonObject user, Action<JsonObject> handshakeCallback)
        {
            this._user = user;
            this._handshakeCallback = handshakeCallback;

            this.InitClient(StartParamType.ALL);
        }
        // connect <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

        public void disconnect()
        {
            Dispose();

            if (this.OnDisconnect != null)
                this.OnDisconnect();
        }

        public void request(string route, Action<JsonObject> action)
        {
            this.request(route, new JsonObject(), action);
        }

        public void request(string route, JsonObject msg, Action<JsonObject> action)
        {
            this.eventManager.AddCallBack(reqId, action);
            protocol.send(route, reqId, msg);

            reqId++;
        }

        public void notify(string route, JsonObject msg)
        {
            protocol.send(route, msg);
        }

        public void on(string eventName, Action<JsonObject> action)
        {
            eventManager.AddOnEvent(eventName, action);
        }

        internal void processMessage(Message msg)
        {
            if (msg.type == MessageType.MSG_RESPONSE)
            {
                eventManager.InvokeCallBack(msg.id, msg.data);
            }
            else if (msg.type == MessageType.MSG_PUSH)
            {
                eventManager.InvokeOnEvent(msg.route, msg.data);
            }
        }
    }
}

