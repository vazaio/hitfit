export default {
    miband: {
        services: {
            battery: 0xfee0,
            pedometer: 0xfee0,
            heartRate: 0x180d
        },
        chars: {
            battery: '00000006-0000-3512-2118-0009af100700',
            pedometer: '00000007-0000-3512-2118-0009af100700',
            heartRate: 0x2a37
        }
    },
    standart: {
        services: {
            battery: 'battery_service',
            pedometer: 'location_and_navigation',
            heartRate: 'heart_rate',
        },
        chars: {
            battery: 'battery_level',//0x2a19
            pedometer: 'ln_feature',//0x2a6a //1bit-total distance, format 32bit
            heartRate: 'heart_rate_measurement'//0x2a37
        }
    }
}
