import { Plugin } from "@vizality/entities"
import { patch } from "@vizality/patcher"
import { getOwnerInstance } from "@vizality/util/react"
import { getModuleByDisplayName, getModule, contextMenu, FluxDispatcher } from "@vizality/webpack"
import { Icon } from "@vizality/components"
import { SettingsContextMenu } from "@vizality/components/vizality"
import React from "react"

const {container} = getModule('container', 'usernameContainer')
const ele = document.querySelector(`.${container}`)
const PanelButton = getModuleByDisplayName("PanelButton")
const {transitionToGuild} = getModule("transitionTo")

export default class panelDashboard extends Plugin {
  start () {
    FluxDispatcher.subscribe("CHANNEL_SELECT", this.channelSwitch = ({ guildId, channelId, messageId }) => this.settings.set("oldChannel", [guildId, channelId, messageId]))
    patch("AccountConnected", getOwnerInstance(ele).__proto__, "render", (_, res) => {
      res.props.children[res.props.children.length - 1].props.children.unshift(<PanelButton 
        icon={() => <Icon name="Vizality" size={20} />}
        tooltipText="Dashboard"
        onClick={() => this.toggle.apply(this)}
        onContextMenu={(evt) => contextMenu.openContextMenu(evt, () => <SettingsContextMenu />)}
      />)
    })
  }
  stop () { FluxDispatcher.unsubscribe("CHANNEL_SELECT", this.channelSwitch) }
  // Simple toggle between dashboard and the channel the user was in before
  toggle () {
    const current = vizality.api.routes.getLocation()
    if (current.pathname.startsWith("/vizality")) transitionToGuild(...this.settings.get("oldChannel"))
    else $vz.routes.navigateTo("dashboard")
  }
}