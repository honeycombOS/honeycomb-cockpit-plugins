var hornetCtl = {
    init: function () {
        // get hornet version
        $('#statusLoading').show();
        var proc = cockpit.spawn(['hornetctl', 'status'], {superuser:"require"})
        proc.done(function (data) {
            try{
                var statusData = JSON.parse(data)
                $('#hornetVersion').text(statusData.version)
                $('.hornetNetwork').text(statusData.networkType)
                $('#nodeStatus').text(statusData.node.status)
                $('#nodeSince').text(statusData.node.since)
		$('#hornetUSBStatus').text(statusData.local)
                $('#hornetDashboardStatus').text(statusData.dashboardStatus)
                $('#dashboardLaunchBtn').data('port', statusData.dashboardPort)
                $('#dashboardLaunchBtn').data('status', statusData.dashboardStatus)
            } catch (e) {
                console.log(e)
            } finally {
                $('#statusLoading').hide()
            }
        })
        proc.fail(hornetCtl.failHandler) 
    },
    start: function () {
        var proc = cockpit.spawn(['hornetctl', 'node', 'on'], {superuser:"require"})
        proc.done(function (data) {
            hornetCtl.init()
        })
        proc.fail(hornetCtl.failHandler) 
    },
    stop: function () {
        var check = confirm('Stop Hornet node. Be patient and wait for Graceful Shutdown.');
        if(check) {
            var proc = cockpit.spawn(['hornetctl', 'node', 'off'], {superuser:"require"});
            proc.done(function () {
                hornetCtl.init()
            })
            proc.fail(hornetCtl.failHandler) 
        }
    },
    restart: function () {
        var check = confirm('Restart Hornet node');
        if(check) {
            var proc = cockpit.spawn(['systemctl', 'restart', 'hornet'], {superuser:"require"});
            proc.done(function () {
                hornetCtl.init()
            })
            proc.fail(hornetCtl.failHandler) 
        }
    },
    networkSelect: function (network) {
        var check = confirm('Change Network to '+ network);
        if(check) {
            var proc = cockpit.spawn(['hornetctl', 'network', network], {superuser:"require"});
            proc.done(function () {
                hornetCtl.init()
            })
            proc.fail(hornetCtl.failHandler)    
        }
    },
    enableUSB: function () {
        var check = confirm('Enable USB Volume?');
        if(check) {
            var proc = cockpit.spawn(['hornetctl', 'usb', 'on'], {superuser:"require"});
            proc.done(function () {
                console.log('here')
                hornetCtl.init()
            })
            proc.fail(hornetCtl.failHandler)    
        }
    },
    disableUSB: function () {
        var check = confirm('Disable USB Volume?');
        if(check) {
            var proc = cockpit.spawn(['hornetctl', 'usb', 'off'], {superuser:"require"});
            proc.done(function () {
                console.log('here')
                hornetCtl.init()
            })
            proc.fail(hornetCtl.failHandler)    
        }
    },
    enableDashboard: function () {
        var check = confirm('Enable Dashboard?');
        if(check) {
            var proc = cockpit.spawn(['hornetctl', 'dashboard', 'on'], {superuser:"require"});
            proc.done(function () {
                console.log('here')
                hornetCtl.init()
            })
            proc.fail(hornetCtl.failHandler)    
        }

    },
    disableDashboard: function () {
        var check = confirm('Disable Dashboard?');
        if(check) {
            var proc = cockpit.spawn(['hornetctl', 'dashboard', 'off'], {superuser:"require"});
            proc.done(function () {
                console.log('here')
                hornetCtl.init()
            })
            proc.fail(hornetCtl.failHandler)    
        }

    },
    launchDashboard: function () {
        var dashboardEnabled = $('#dashboardLaunchBtn').data('status')
        var dashboardPort = $('#dashboardLaunchBtn').data('port')
        if(dashboardEnabled) {
            var url = window.location.protocol+'//'+window.location.hostname+':'+dashboardPort
            console.log(url)
            window.open(url)
        } else {
            alert('Dashboard not enabled')
        }

    },
    cleanDB: function () {
        var check = confirm('Clean database?');
        if(check) {
            var proc = cockpit.spawn(['hornetctl', 'clean', 'db'], {superuser:"require"});
            proc.done(function () {
                window.alert('Database clean successful')
            })
            proc.fail(hornetCtl.failHandler) 
        }

    },
    snapshot: function () {
        var check = confirm('Clean Snapshot?');
        if(check) {
            var proc = cockpit.spawn(['hornetctl', 'clean', 'snapshot'], {superuser:"require"});
            proc.done(function () {
                window.alert('Snapshot clean successful')
            })
            proc.fail(hornetCtl.failHandler)   
        }
    },
    failHandler: function (err, data) {
        console.log(err, data)
        $('#alertInfo').text(err.message + "\n" + data)
        $('#alertModal').modal()
    }
}

