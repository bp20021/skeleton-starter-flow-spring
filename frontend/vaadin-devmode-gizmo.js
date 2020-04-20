import {LitElement, html, css} from 'lit-element';

class VaadinDevmodeGizmo extends LitElement {

  static get styles() {
    return css`
       :host {
          --gizmo-border-radius: 1rem;
          
          --gizmo-active-color: hsl(145, 80%, 42%);
          --gizmo-inactive-color: hsl(0, 0%, 50%);
          --gizmo-unavailable-color: hsl(36, 100%, 61%);
          --gizmo-error-color: hsl(3, 100%, 61%);
       }

      .gizmo {
          display: flex;
          align-items: center;
          justify-content: center;
          position: fixed;
          right: 0;
          bottom: 1rem;
          height: 2rem;
          width: auto;
          border-top-left-radius: var(--gizmo-border-radius);
          border-bottom-left-radius: var(--gizmo-border-radius);
          padding-left: .5rem;
          background-color: rgba(50,50,50,.15);
          color: rgba(255,255,255,.8);
          transform: translateX(calc(100% - 2rem));
          transition: 400ms;
          z-index: 20000;
      }

      .gizmo:hover,
      .gizmo.active {
          transform: translateX(0);
          background-color: rgba(50,50,50,1);
      }
      
      .gizmo .vaadin-logo {
          pointer-events: none;
          display: inline-block;
          width: 16px;
          height: 16px;
          fill: #fff;
          opacity: 1;
          transition: 400ms;
      }
      
      .gizmo:hover .vaadin-logo,
      .gizmo.active .vaadin-logo {
          opacity: 0;
          width: 0px;
          margin-right: 0.25em;
      }
      
      .gizmo .status-blip {
          display: block;
          width: 0.75rem;
          height: 0.75rem;
          border-radius: 50%;
          z-index: 20001;
          background-color: var(--gizmo-active-color);
          transform: translate(-14px, 7px) scale(.5);
          transition: 400ms;
      }

      .gizmo:hover .status-blip,
      .gizmo.active .status-blip {
          transform: translate(0, 0) scale(1);
      }
      
      .gizmo > * {
          margin-right: .5rem;
      }

      .switch {
          position: relative;
          display: inline-block;
          margin-top: auto;
          margin-bottom: auto;
          width: 28px;
          height: 18px;
      }

      .switch input {
          opacity: 0;
          width: 0;
          height: 0;
      }

      .switch .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 18px;
        background-color: rgba(255, 255, 255, 0.3);
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .switch .slider:hover {
        background-color: rgba(255, 255, 255, 0.35);
        transition: 0ms;
      }

      .switch .slider:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
        border-radius: 50%;
      }

      .switch input:checked + .slider {
        background-color: var(--gizmo-active-color);
      }

      .switch input:checked + .slider:before {
        -webkit-transform: translateX(10px);
        -ms-transform: translateX(10px);
        transform: translateX(10px);
      }

      .window.hidden {
          opacity: 0;
          transform: scale(0.1,0.4);
      }

      .window.visible {
          transform: scale(1,1);
          opacity: 1;
      }

      .window.visible ~ .gizmo {
          opacity: 0;
      }

      .window.hidden ~ .gizmo {
          opacity: 1;
      }

      .window {
          position: fixed;
          right: 1rem;
          bottom: 1rem;
          border-radius: .5rem;
          width: 480px;
          font-size: 14px;
          background-color: rgba(50,50,50,1);
          color: #fff;
          transition: 400ms;
          transform-origin: bottom right;
      }

      .window-header {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          background-color: rgba(40,40,40,1);
          border-radius: .5rem .5rem 0px 0px;
          border-bottom: 1px solid rgba(70,70,70,1);
          padding: .25rem .5rem;
          text-align: right;
      }

      .message-tray .message {
          padding: .25rem .5rem;
      }
      .message-tray .message:not(:last-of-type) {
          border-bottom: 1px solid rgba(70,70,70,1);
      }

      .message-tray .message:before {
          content: "ⓘ";
          margin-right: .5rem;
      }

      .ahreflike {
          cursor: pointer;
          font-weight: 600;
      }

      .live-reload-text {
          padding: 0 .5rem 0 .25rem;
      }
      
      .minimize-button {
          width: 17px;
          height: 17px;
          color: #fff;
          background-color: transparent;
          border: 0;
          padding: 0;
          margin-left: .25rem;
          opacity: .8;
      }
      
      .minimize-button:hover {
          opacity: 1;
      }
    `;
  }

  static get properties() {
    return {
      expanded: {type: Boolean},
      messages: {type: Array},
      status: {type: String},
      notification: {type: String},
      serviceurl: {type: String},
      liveReloadBackend: {type: String},
      springBootDevToolsPort: {type: Number}
    };
  }

  static get ACTIVE() {
    return 'active';
  }

  static get INACTIVE() {
    return 'inactive';
  }

  static get UNAVAILABLE() {
    return 'unavailable';
  }

  static get ERROR() {
    return 'error';
  }

  static get ENABLED_KEY_IN_LOCAL_STORAGE() {
    return 'vaadin.live-reload.enabled';
  }

  static get ACTIVE_KEY_IN_SESSION_STORAGE() {
    return 'vaadin.live-reload.active';
  }

  static get TRIGGERED_KEY_IN_SESSION_STORAGE() {
    return 'vaadin.live-reload.triggered';
  }

  static get TRIGGERED_COUNT_KEY_IN_SESSION_STORAGE() {
    return 'vaadin.live-reload.triggeredCount';
  }

  static get HEARTBEAT_INTERVAL() {
    return 180000;
  }

  static get AUTO_DEMOTE_NOTIFICATION_DELAY() {
    return 5000;
  }

  static get HOTSWAP_AGENT() {
    return 'HOTSWAP_AGENT';
  }

  static get JREBEL() {
    return 'JREBEL';
  }

  static get SPRING_BOOT_DEVTOOLS() {
    return 'SPRING_BOOT_DEVTOOLS';
  }

  static get BACKEND_DISPLAY_NAME() {
    return {
      HOTSWAP_AGENT: 'HotswapAgent',
      JREBEL: 'JRebel',
      SPRING_BOOT_DEVTOOLS: 'Spring Boot Devtools'
    };
  }

  static get isEnabled() {
    const enabled = window.localStorage.getItem(VaadinDevmodeGizmo.ENABLED_KEY_IN_LOCAL_STORAGE);
    return enabled === null || !(enabled === 'false');
  }

  static get isActive() {
    const active = window.sessionStorage.getItem(VaadinDevmodeGizmo.ACTIVE_KEY_IN_SESSION_STORAGE);
    return active === null || active !== 'false';
  }

  constructor() {
    super();
    this.messages = [];
    this.expanded = false;
    this.status = VaadinDevmodeGizmo.UNAVAILABLE;
    this.notification = null;
    this.connection = null;
  }

  openWebSocketConnection() {
    if (this.connection !== null) {
      this.connection.close();
      this.connection = null;
    }
    const hostname = window.location.hostname;
    // try Spring Boot Devtools first, if port is set
    if (this.liveReloadBackend === VaadinDevmodeGizmo.SPRING_BOOT_DEVTOOLS && this.springBootDevToolsPort) {
      const self = this;
      self.connection = new WebSocket(
        'ws://' + hostname + ':' + this.springBootDevToolsPort);
    } else if (this.liveReloadBackend) {
      this.openDedicatedWebSocketConnection();
    } else {
      this.showMessage('Live reload unavailable');
    }
    if (this.connection) {
      this.connection.onmessage = msg => this.handleMessage(msg);
      this.connection.onerror = err => this.handleError(err);
      this.connection.onclose = _ => {
        self.status = VaadinDevmodeGizmo.UNAVAILABLE;
        self.connection = null;
      };
    }
  }

  openDedicatedWebSocketConnection() {
    const url = this.serviceurl ? this.serviceurl : window.location.toString();
    if (!url.startsWith('http://')) {
      console.warn('The protocol of the url should be http for live reload to work.');
      return;
    }
    const wsUrl = url.replace(/^http:/, 'ws:') + '?refresh_connection';
    const self = this;
    this.connection = new WebSocket(wsUrl);
    setInterval(function() {
      if (self.connection !== null) {
        self.connection.send('');
      }
    }, VaadinDevmodeGizmo.HEARTBEAT_INTERVAL);
  }

  handleMessage(msg) {
    const json = JSON.parse(msg.data);
    const command = json['command'];
    switch (command) {
      case 'hello': {
        if (this.liveReloadBackend) {
          if (VaadinDevmodeGizmo.isActive) {
            this.status = VaadinDevmodeGizmo.ACTIVE;
          } else {
            this.status = VaadinDevmodeGizmo.INACTIVE;
          }
          const backend = VaadinDevmodeGizmo.BACKEND_DISPLAY_NAME[this.liveReloadBackend];
          this.showMessage('Live reload available: ' + backend);
        } else {
          this.status = VaadinDevmodeGizmo.INACTIVE;
        }
        break;
      }

      case 'reload':
        if (this.status === VaadinDevmodeGizmo.ACTIVE) {
          this.showNotification('Reloading...');
          const lastReload = window.sessionStorage.getItem(VaadinDevmodeGizmo.TRIGGERED_COUNT_KEY_IN_SESSION_STORAGE);
          const nextReload = lastReload ? (parseInt(lastReload) + 1) : 1;
          window.sessionStorage.setItem(VaadinDevmodeGizmo.TRIGGERED_COUNT_KEY_IN_SESSION_STORAGE, nextReload.toString());
          window.sessionStorage.setItem(VaadinDevmodeGizmo.TRIGGERED_KEY_IN_SESSION_STORAGE, 'true');
          window.location.reload();
        }
        break;

      default:
        console.warn('Unknown command received from the live reload server:', command);
    }
  }

  handleError(msg) {
    console.error(msg);
    this.status = VaadinDevmodeGizmo.ERROR;
  }

  connectedCallback() {
    super.connectedCallback();

    // when focus or clicking anywhere, move the notification to the message tray
    this.disableEventListener = e => this.demoteNotification();
    document.body.addEventListener('focus', this.disableEventListener);
    document.body.addEventListener('click', this.disableEventListener);
    this.openWebSocketConnection();

    const lastReload = window.sessionStorage.getItem(VaadinDevmodeGizmo.TRIGGERED_KEY_IN_SESSION_STORAGE);
    if (lastReload) {
      const count = window.sessionStorage.getItem(VaadinDevmodeGizmo.TRIGGERED_COUNT_KEY_IN_SESSION_STORAGE);
      const now = new Date();
      const reloaded = ('0' + now.getHours()).slice(-2) + ':'
        + ('0' + now.getMinutes()).slice(-2) + ':'
        + ('0' + now.getSeconds()).slice(-2);
      this.showNotification('Automatic reload #' + count + ' finished at ' + reloaded);
      window.sessionStorage.removeItem(VaadinDevmodeGizmo.TRIGGERED_KEY_IN_SESSION_STORAGE);
    }
  }

  disconnectedCallback() {
    document.body.removeEventListener('focus', this.disableEventListener);
    document.body.removeEventListener('click', this.disableEventListener);
    super.disconnectedCallback();
  }

  disableLiveReload() {
    if (this.connection !== null) {
      this.connection.close();
      this.connection = null;
    }
    window.localStorage.setItem(VaadinDevmodeGizmo.ENABLED_KEY_IN_LOCAL_STORAGE, 'false');
    this.remove();
  }

  toggleExpanded() {
    this.expanded = !this.expanded;
  }

  showNotification(msg) {
    this.notification = msg;
    // automatically move notification to message tray after a certain amount of time
    if (this.notification != null) {
      setTimeout(() => {
        this.demoteNotification();
      }, VaadinDevmodeGizmo.AUTO_DEMOTE_NOTIFICATION_DELAY);
    }
  }

  showMessage(msg) {
    this.messages.push(msg);
  }

  demoteNotification() {
    if (this.notification) {
      this.showMessage(this.notification);
    }
    this.showNotification(null);
  }

  setActive(yes) {
    if (yes) {
      window.sessionStorage.setItem(VaadinDevmodeGizmo.ACTIVE_KEY_IN_SESSION_STORAGE, 'true');
      this.status = VaadinDevmodeGizmo.ACTIVE;
    } else {
      window.sessionStorage.setItem(VaadinDevmodeGizmo.ACTIVE_KEY_IN_SESSION_STORAGE, 'false');
      this.status = VaadinDevmodeGizmo.INACTIVE;
    }
  }

  getStatusColor() {
    if (this.status === VaadinDevmodeGizmo.ACTIVE) {
      return 'var(--gizmo-active-color)';
    } else if (this.status === VaadinDevmodeGizmo.INACTIVE) {
      return 'var(--gizmo-inactive-color)';
    } else if (this.status === VaadinDevmodeGizmo.UNAVAILABLE) {
      return 'var(--gizmo-unavailable-color)';
    } else if (this.status === VaadinDevmodeGizmo.ERROR) {
      return 'var(--gizmo-error-color)';
    } else {
      return 'none';
    }
  }

  render() {
    return html`
            <div class="vaadin-live-reload">

            <div class="window ${this.expanded ? 'visible' : 'hidden'}">
                    <div class="window-header">
                        <label class="switch">
                            <input id="toggle" type="checkbox"
                                ?disabled=${this.status === VaadinDevmodeGizmo.UNAVAILABLE || this.status === VaadinDevmodeGizmo.ERROR}
                                ?checked="${this.status === VaadinDevmodeGizmo.ACTIVE}"
                            @change=${e => this.setActive(e.target.checked)}/>
                            <span class="slider"></span>
                         </label>
                         <span class="live-reload-text">Live-reload</span>
                         <button class="minimize-button" @click=${e => this.toggleExpanded()}>
                           <svg xmlns="http://www.w3.org/2000/svg" style="width: 18px; height: 18px;">
                             <g stroke="#fff" stroke-width="1.25">
                               <rect rx="5" x="0.5" y="0.5" height="16" width="16" fill-opacity="0"/>
                               <line y2="12.1" x2="12.3" y1="3.4" x1="3" />
                               <line y2="8.5" x2="12.1" y1="12.4" x1="12.8" />
                               <line y2="12.1" x2="8.7" y1="12.1" x1="12.8" />
                             </g>
                          </svg>
                        </button>
                    </div>
                    <div class="message-tray">
                         ${this.messages.map(i => html`<div class="message">${i}</div>`)}
                    </div>
                </div>

      <div class="gizmo ${this.notification !== null ? 'active' : ''}" @click=${e => this.toggleExpanded()}>
        <svg viewBox="0 0 16 16" preserveAspectRatio="xMidYMid meet" focusable="false" class="vaadin-logo">
          <g><title>vaadin-logo</title>
          <path d="M15.21 0.35c-0.436 0-0.79 0.354-0.79 0.79v0 0.46c0 0.5-0.32 0.85-1.070 0.85h-3.55c-1.61 0-1.73 1.19-1.8 1.83v0c-0.060-0.64-0.18-1.83-1.79-1.83h-3.57c-0.75 0-1.090-0.37-1.090-0.86v-0.45c0-0.006 0-0.013 0-0.020 0-0.425-0.345-0.77-0.77-0.77-0 0-0 0-0 0h0c-0 0-0 0-0 0-0.431 0-0.78 0.349-0.78 0.78 0 0.004 0 0.007 0 0.011v-0.001 1.32c0 1.54 0.7 2.31 2.34 2.31h3.66c1.090 0 1.19 0.46 1.19 0.9 0 0 0 0.090 0 0.13 0.048 0.428 0.408 0.758 0.845 0.758s0.797-0.33 0.845-0.754l0-0.004s0-0.080 0-0.13c0-0.44 0.1-0.9 1.19-0.9h3.61c1.61 0 2.32-0.77 2.32-2.31v-1.32c0-0.436-0.354-0.79-0.79-0.79v0z"></path>
          <path d="M11.21 7.38c-0.012-0-0.026-0.001-0.040-0.001-0.453 0-0.835 0.301-0.958 0.714l-0.002 0.007-2.21 4.21-2.3-4.2c-0.122-0.425-0.507-0.731-0.963-0.731-0.013 0-0.026 0-0.039 0.001l0.002-0c-0.012-0-0.025-0.001-0.039-0.001-0.58 0-1.050 0.47-1.050 1.050 0 0.212 0.063 0.41 0.171 0.575l-0.002-0.004 3.29 6.1c0.15 0.333 0.478 0.561 0.86 0.561s0.71-0.228 0.858-0.555l0.002-0.006 3.34-6.1c0.090-0.152 0.144-0.335 0.144-0.53 0-0.58-0.47-1.050-1.050-1.050-0.005 0-0.010 0-0.014 0h0.001z"></path>
          </g>
        </svg>
        <span class="status-blip" style="background-color: ${this.getStatusColor()}"></span>
    ${this.notification !== null
      ? html`<span class="status-description">${this.notification}</span></div>`
      : html`<span class="status-description">Live-reload ${this.status} </span><span class="ahreflike">Show</span></div>`
    }
      </div>`;
  }
}

customElements.define('vaadin-devmode-gizmo', VaadinDevmodeGizmo);